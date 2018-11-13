// * Imports

import { createReducer, createActions } from "reduxsauce";
import { createSelector } from "reselect";
import Immutable from "seamless-immutable";
import R from "ramda";
import moment from "moment";

import { CaptureSelectors } from "./CaptureRedux";
import { pathToFileName } from "../utils/files";

// * Constants

export const ModeTypes = Object.freeze({
  OUTLINE: "outline",
  AGENDA: "agenda",
  BROWSER: "browser"
});

const DAY_FORMAT = "YYYY-MM-DD";

const DATA_STACKS = [
  "notes",
  "search",
  "searchResults",
  "agenda",
  "agendaResults",
  "markedPlaces",
  "lastCaptured"
];

// addToLastCaptured
// getExternallyChangedFiles

// * Types And Action Creators

const { Types, Creators } = createActions({
  /* ------------- mod actions ------------- */
  mergeNodeChanges: ["changes", "nodesIds"],
  updateNode: ["node", "nodesIds"],
  deleteNodes: ["ids"],

  addToLastCaptured: ["node"],
  loadWeekAgenda: ["date"],
  loadDayAgenda: ["date"],
  rescheduleAgenda: ["changes", "nodesIds"],
  updateTimestamps: ["agendaItems", "dayAgendaItems", "range"],
  updateLoadedNodes: ["nodes"],
  addNotebookRequest: null,
  addNotebook: ["name"],
  deleteFile: ["id"],
  updateFile: ["item"],
  showFileActionsDialog: ["item"],
  getOrgDataSuccess: ["files", "tags", "timestamps"],
  getOrgDataRequest: null,
  addOrgFileRequest: ["filepath"],
  addOrgFileSuccess: ["filepath"],
  clearDbRequest: null,
  clearDbSuccess: null,
  syncAllFilesRequest: null,
  syncAllFilesSuccess: null,
  resetStack: ["screenId"],
  removeNodes: ["ids"],
  updateFileIds: ["fileId", "nodesIds", "tocIds"],
  stackLoaded: ["name"],
  setMode: ["mode"],
  cycleMode: null,
  toggleMark: ["node"],
  clearLastAddedNode: null,
  navigationStackChanged: ["to"],
  move: ["id", "direction", "withDescendants"],
  loadToc: ["fileId", "navigator"],
  visitPlace: ["fileId", "nodeId", "navigationStack"],
  // updateNode: ["node", "nodesIds", "navigationStack"],
  reset: null,
  openFileRequest: ["fileId", "nodeId"],
  updateOrgData: ["fileData", "nodesList", "nodeID"],
  loadRelatedNodes: ["nodeId"],
  runNodeAction: ["actionName", "ids", "navigator", "node", "navigationStack"],
  runNodeActionRequest: [
    "actionName",
    "ids",
    "navigator",
    "node",
    "navigationStack",
    "doAfterAction",
    "doBeforeAction",
    "payload"
  ],
  openIds: ["ids", "navigationStack"]
});

export const OrgDataTypes = Types;
export default Creators;

// * Initial State

const withSuccess = R.merge({
  isBusy: false,
  errors: null
});

export const INITIAL_STATE = Immutable(
  withSuccess({
    nodes: {},
    files: {},
    tags: [],
    timestamps: [],
    timestampsRange: {
      start: moment().format(DAY_FORMAT),
      end: moment().format(DAY_FORMAT)
    },
    isBusy: false,
    navigationStackHistory: [],
    // mode: "browser", Moved to local state
    lastCapturedNodes: [],
    tocIds: {},
    agendaRange: {},
    visitedFileId: R.into({}, R.map(obj => ({ [obj]: null })), DATA_STACKS),
    visitedNodeId: R.into({}, R.map(obj => ({ [obj]: null })), DATA_STACKS),
    // loadedNodesData: R.into({}, R.map(obj => ({ [obj]: {} })), DATA_STACKS),
    loadedNodesIds: R.into({}, R.map(obj => ({ [obj]: [] })), DATA_STACKS),
    isDataLoaded: R.into({}, R.map(obj => ({ [obj]: false })), DATA_STACKS)
  })
);

// * Outline functions

export const getDescendantsIds = ({
  nodeId,
  loadedNodesData,
  loadedNodesIds
}) =>
  R.pipe(
    R.drop(loadedNodesData[nodeId].position + 1),
    R.takeWhile(id => loadedNodesData[id].level > loadedNodesData[nodeId].level)
  )(loadedNodesIds);

export const findNextNodeSameLevel = ({ nodeId, nodes }) =>
  R.pipe(
    R.dropWhile(R.complement(R.equals(nodeId))),
    R.drop(1),
    R.find(id => nodes[id].level === nodes[nodeId].level)
  );

export const findPrevNodeSameLevel = ({ nodeId, nodes }) =>
  R.pipe(R.reverse, findNextNodeSameLevel({ nodeId, nodes }));

// * Browser Selectors

const fromGlobal = state => state.data;
const fg = R.pipe(fromGlobal, R._);
const getCurrentNavigationStack = state => state.navigationStackHistory[0];

const cs = state => state[getCurrentNavigationStack(state)];
const gs = (...path) => state => R.pathOr(undefined, ["data", ...path])(state);

// const getLoadedNodesData = createSelector([fg(getCurrentNavigationStack), fg(R.prop('loadedNodesData'))], (navStack, data) => data[navStack])
const getLoadedNodesData = gs("nodes");
const getLoadedFileData = gs("loadedFileData");

const getVisitedLoadedNodesData = R.converge((data, stack) => data[stack], [
  gs("loadedNodesData"),
  R.pipe(fromGlobal, getCurrentNavigationStack)
]);
const getVisitedLoadedNodesIds = R.converge((data, stack) => data[stack], [
  gs("loadedNodesIds"),
  R.pipe(fromGlobal, getCurrentNavigationStack)
]);

const getVisitedStack = R.applySpec({
  loadedNodesIds: R.converge((data, stack) => data[stack], [
    gs("loadedNodesIds"),
    R.pipe(fromGlobal, getCurrentNavigationStack)
  ]),
  loadedNodesData: R.converge((data, stack) => data[stack], [
    gs("loadedNodesData"),
    R.pipe(fromGlobal, getCurrentNavigationStack)
  ])
});

// const getVisitedLoadedFileData = gs("loadedFileData");
const getLoadedNodesIds = gs("loadedNodesIds");
const getVisitedNodeId = gs("visitedNodeId");
const getVisitedFileId = gs("visitedFileId");

const getLastAddedNode = gs("lastAddedNode");

const getCSVisitedNodeId = state =>
  gs("visitedNodeId")[getCurrentNavigationStack(fromGlobal(state))];
const getCSVisitedFileId = state =>
  gs("visitedFileId")[getCurrentNavigationStack(fromGlobal(state))];

const isDataLoaded = gs("isDataLoaded");
const navigationStackHistory = state => state.data.navigationStackHistory;

// Returns visited node if node is visited
// Otherwise returns file object or null if nothing is visited
const getVisitedObject = state => {
  const cns = getCurrentNavigationStack(fromGlobal(state));
  const fileId = state.data.visitedFileId[cns];
  const nodeId = state.data.visitedNodeId[cns];
  const nodesData = state.data.nodes;
  if (R.all(R.isNil)([fileId, nodeId])) {
    return null;
  } else if (R.isNil(nodeId)) {
    // Visiting file
    return OrgDataSelectors.getFiles(state)[fileId];
  } else {
    // Visiting node
    return nodesData[nodeId];
  }
};

const getNodes = navStack =>
  createSelector(
    [state => state.data.loadedNodesIds[navStack], state => state.data.nodes],
    (ids, data) => ids.map(id => data[id])
  );

const getSearchResults = getNodes("searchResults");
const getAgenda = getNodes("agenda");
const getMarkedPlaces = getNodes("markedPlaces");

export const OrgData = {};

// const getBreadcrumbs = createSelector(
//   [getCurrentNavigationStack])
// * Selectors

export const OrgDataSelectors = {
  getLastCapturedNotes: createSelector(
    [
      R.path(["data", "loadedNodesIds", "lastCaptured"]),
      R.path(["data", "nodes"])
    ],
    (ids, data) => ids.map(id => data[id])
  ),
  getLastCapturedNodesIds: R.path(["data", "loadedNodesIds", "lastCaptured"]),
  getFile: id => R.path(["data", "files", id]),
  getFiles: R.path(["data", "files"]),
  getTimestamps: R.path(["data", "timestamps"]),
  getDayTimestamps: R.path(["data", "dayTimestamps"]),
  getTimestampsRange: R.path(["data", "timestampsRange"]),
  getFilesIds: createSelector([R.path(["data", "files"])], files =>
    R.keys(files)
  ),
  getNodes: R.path(["data", "nodes"]),
  getNode: id => R.path(["data", "nodes", id]),
  isBusy: state => state.data.isBusy,
  getTags: state => state.data.tags,
  getFileNodes: fileId => state =>
    R.pipe(
      R.filter(node => node.fileId === fileId),
      R.values,
      R.sortBy(R.prop("position"))
    )(state.data.nodes),

  // isVisitedPlaceSink: () => false,

  isVisitedPlaceSink: createSelector(
    [
      getVisitedObject,
      R.path(["capture", "captureTemplates"]),
      R.path(["data", "isDataLoaded"])
    ],
    (visitedObj, captureTemplates) => {
      // Visited obj is
      // FIXME: wywala się przy wejściu na capture template zagniżdżone
      // Działą to zresztą hujowo powinno sie znaleźð w stanie lokalnym
      return false;
      if (visitedObj === null) return false;

      captureTemplates = R.values(captureTemplates);

      for (var i = 0; i < captureTemplates.length; i++) {
        const target = captureTemplates[i].target;

        if (visitedObj.headline && target.headline) {
          // target and visited obj both are nodes
          if (target.headline == visitedObj.headline) return true;
          // console.tron.warn(target.headline == visitedObj.headline);
          // return true
        }

        if (!visitedObj.headline && !(target.headline || target.nodeId)) {
          // target and visited obj both are files
          if (target.fileId === visitedObj.id) return true;
        }

        return false;
      }
    }
  ),

  getLoadedFileData,
  getVisitedStack,
  // getLoadedNodesData,
  getLoadedNodesIds,
  getVisitedNodeId,
  getVisitedFileId,
  getVisitedObject,
  getCSVisitedNodeId,
  getCSVisitedFileId,
  isDataLoaded,
  navigationStackHistory,
  getSearchResults,
  getAgenda,
  getMarkedPlaces,
  getLastAddedNode,
  getMode: state => state.data.mode,
  getCurrentNavigationStack: state => state.data.navigationStackHistory[0]
  // getBreadcrumbs
};

// * browser Reducers

export const resetStack = (state, { navigationStack }) => {
  /* ------------- Reset Ids ------------- */

  console.tron.warn("resset stack" + navigationStack);
  const newState = R.pipe(
    R.cond([
      [
        () => navigationStack === "searchResults",
        ns =>
          ns
            .setIn(["loadedNodesIds", "searchResults"], [])
            .setIn(["isDataLoaded", "searchResults"], false)
            .setIn(["loadedNodesIds", "search"], [])
            .setIn(["isDataLoaded", "search"], false)
      ],
      [
        () => navigationStack === "notes",
        ns =>
          ns
            .setIn(["loadedNodesIds", "notes"], [])
            .setIn(["isDataLoaded", "notes"], false)
      ],
      [
        () => navigationStack === "agenda",
        ns =>
          ns
            .setIn(["loadedNodesIds", "agenda"], [])
            .setIn(["isDataLoaded", "agenda"], false)
            .setIn(["loadedNodesIds", "agendaResults"], [])
            .setIn(["isDataLoaded", "agendaResults"], false)
      ],
      [R.T, R.identity]
    ]),

    /* ------------- Delete nodes ------------- */

    R.converge(
      (ns, nodesIds) =>
        ns.set("nodes", ns.nodes.without(nodesIds)).set("mode", "browser"),
      [
        R.identity,
        ns => {
          const ids = R.chain(stack => state.loadedNodesIds[stack])(
            DATA_STACKS
          );
          const newIds = R.chain(stack => ns.loadedNodesIds[stack])(
            DATA_STACKS
          );
          const tocIds = R.chain(fileId => ns.tocIds[fileId])(
            R.keys(state.tocIds)
          );
          return R.difference(ids, R.concat(newIds, tocIds));
        }
      ]
    )
  )(state);

  return newState;
};

export const removeNodes = (state, { ids }) => {
  return state.merge({
    loadedNodesIds: R.map(R.without(ids), state.loadedNodesIds),
    tocIds: R.map(R.without(ids), state.tocIds)
  });
};

export const loadToc = (state, { fileId, navigator }) => {
  const cs = getCurrentNavigationStack(state);
  return state.setIn(["loadedNodesIds", cs], state.tocIds[fileId]);
};

export const stackLoaded = (state, { name }) => {
  const cs = name || getCurrentNavigationStack(state);
  return state.merge({
    isDataLoaded: state.isDataLoaded.setIn([cs], true)
  });
};

export const setMode = (state, { mode }) => {
  return state.merge({ mode });
};

export const cycleMode = state => {
  switch (state.mode) {
    case ModeTypes.BROWSER:
      return state.merge({ mode: ModeTypes.OUTLINE });
    case ModeTypes.OUTLINE:
      return state.merge({ mode: ModeTypes.AGENDA });
      break;
    case ModeTypes.AGENDA:
      return state.merge({ mode: ModeTypes.BROWSER });
      break;
  }
  state.merge({ mode: "outline" });
};

export const clearLastAddedNode = state => {
  return state.merge({
    lastAddedNode: null
  });
};

export const navigationStackChanged = (state, { to }) => {
  if (state.navigationStackHistory[0] === to) return state;

  return state.merge({
    navigationStackHistory: R.pipe(
      R.prepend(to),
      R.when(R.pipe(R.length, R.gt(R.__, 2)), R.dropLast(1))
    )(state.navigationStackHistory)
  });
};

export const reset = state => state.merge(INITIAL_STATE);

export const openFileRequest = state =>
  state.merge({
    [getCurrentNavigationStack(state)]: {
      isDataLoaded: false
    }
  });

export const loadRelatedNodes = (state, action) => state.merge({});

const updateOrgData = (state, { fileData, nodesList }) => {
  const cs = getCurrentNavigationStack(state);
  return state.merge({
    // loadedFileData: state.loadedFileData.setIn([cs], fileData),
    loadedNodesData: state.loadedNodesData.setIn(
      [cs],
      R.indexBy(R.prop("id"), nodesList)
      // R.into({}, R.map(R.identity), nodesList)
    ),
    loadedNodesIds: state.loadedNodesIds.setIn(
      [cs],
      nodesList.map(node => node.id)
    ),
    visitedFileId: state.visitedFileId.setIn([cs], fileData.id),
    isDataLoaded: state.isDataLoaded.setIn([cs], true)
  });
};

export const openIds = (state, { ids, navigationStack }) => {
  const stack = navigationStack || getCurrentNavigationStack(state);
  return state.merge({
    loadedNodesIds: state.loadedNodesIds.setIn([stack], ids)
  });
};

const visitPlace = (state, { fileId, nodeId, navigationStack }) => {
  const visitedNodeId = state.visitedNodeId[navigationStack];
  const visitedFileId = state.visitedFileId[navigationStack];

  let newState = state;

  if (R.isNil(fileId) && !R.isNil(visitedFileId)) {
    // Last note on stack is closed, so you should reset this fucking stack
    newState = resetStack(newState, { navigationStack });
  }

  return newState.merge({
    visitedNodeId: state.visitedNodeId.setIn([navigationStack], nodeId),
    visitedFileId: state.visitedFileId.setIn([navigationStack], fileId)
  });
};

export const updateFileIds = (state, { fileId, nodesIds, tocIds }) => {
  return R.pipe(
    R.when(() => tocIds !== null, ns => ns.setIn(["tocIds", fileId], tocIds)),
    R.when(
      () => nodesIds !== null,
      ns =>
        doOnEachStack(ns, (ids, visitedFileId) => {
          return visitedFileId === fileId ? nodesIds : ids;
        })
    )
  )(state);
};

const doOnEachStack = (state, handler) => {
  let loadedNodesIds = state.loadedNodesIds;

  DATA_STACKS.forEach(stack => {
    const ids = loadedNodesIds[stack];
    const visitedFileId = state.visitedFileId[stack];
    const visitedNodeId = state.visitedNodeId[stack];
    const newIds = handler(ids, visitedFileId, visitedNodeId);

    if (newIds !== ids)
      loadedNodesIds = loadedNodesIds.merge({ [stack]: newIds });
  });

  return loadedNodesIds !== state.loadedNodesIds
    ? state.merge({
        loadedNodesIds
      })
    : state;
};

// * Reducers

export const toggleMark = (state, { node }) => {
  const nodesIds = state.loadedNodesIds.markedPlaces;
  const val = R.ifElse(R.contains(node.id), R.without([node.id]), R.prepend(node.id))(nodesIds)

  return state.setIn(['loadedNodesIds', 'markedPlaces'], val ) }

export const addToLastCaptured = (state, { node }) => {
  return state.setIn(
    ["loadedNodesIds", "lastCaptured"],
    R.pipe(R.prepend(node.id), R.when(list => list.length > 20, R.dropLast(1)))(
      state.loadedNodesIds.lastCaptured
    )
  );
};

export const addOrgFileRequest = (state, { filepath }) => {
  return state.merge({});
};

export const deleteNodes = (state, { ids }) => {
  return state.merge({
    nodes: R.omit(ids, state.nodes),
    timestamps: R.reject(ts => ids.includes(ts.nodeId))(state.timestamps),
    dayTimestamps: R.reject(ts => ids.includes(ts.nodeId))(state.dayTimestamps)
  });
};

export const loadDayAgenda = (state, { date }) => {
  return state.merge({
    timestampsRange: {
      start: moment(date).format(DAY_FORMAT),
      end: moment(date).format(DAY_FORMAT)
    }
  });
};

export const loadWeekAgenda = (state, { date }) => {
  return state.merge({
    timestampsRange: {
      start: moment(date)
        .startOf("week")
        .format(DAY_FORMAT),
      end: moment(date)
        .endOf("week")
        .format(DAY_FORMAT)
    }
  }).setIn(['isDataLoaded', 'agenda'], false);
};

export const rescheduleAgenda = (
  state,
  { changes: { timestamps }, nodesIds }
) => {

  const reject = range => R.reject(ts => {
    const date = moment(ts.date);
    return date.isBefore(range.start, "day") || date.isAfter(range.end, "day");
  });

  const rejectIfNotInRange = reject(state.timestampsRange)

  const rejectIfNotToday = reject({ start: moment(), end: moment()});

  const newAgendaTimestamps = R.pipe(
    rejectIfNotInRange,
    R.chain(({ type }) => nodesIds.map(nodeId => ({ nodeId, type })))
  )(timestamps);

  const newDayAgendaTimestamps = R.pipe(
    rejectIfNotToday,
    R.chain(({ type }) => nodesIds.map(nodeId => ({ nodeId, type })))
  )(timestamps);

  const transform = prevState => R.pipe(
    R.reject(ts => nodesIds.includes(ts.nodeId)),
    R.concat(prevState),
    // R.sortBy(
    //   ({ type, nodeId }) =>
    //     R.find(R.propEq("type", type), state.nodes[nodeId].timestamps).date
    // )
  );

  const agendaName = 'timestamps'

  return state.merge({
    timestamps: transform(newAgendaTimestamps)(state.timestamps),
    dayTimestamps: transform(newDayAgendaTimestamps)(state.dayTimestamps),
  });
};

export const updateTimestamps = (state, { agendaItems, dayAgendaItems, range }) => {
  return state.merge({
    timestamps: agendaItems,
    dayTimestamps: dayAgendaItems,
    timestampsRange: range
  });
};

const mergeNodeChanges = (state, { changes, nodesIds }) => {
  let newLoadedNodesData = state.nodes;

  if (!nodesIds) nodesIds = [changes.id];

  const updatedNodes = R.into(
    {},
    R.addIndex(R.map)((id,idx) => ({
      [id]: {
        ...state.nodes[id],
        ...(Array.isArray(changes) ? changes[idx] : changes)
      }
    })),
    nodesIds
  );
  return state.merge({
    nodes: state.nodes.merge(updatedNodes)
  });
};

export const updateLoadedNodes = (state, { nodes }) => {
  return state.merge({
    nodes: state.nodes.merge(nodes)
  });
};

export const addNotebook = (state, { name }) => {
  return state.merge({});
};

export const deleteFile = (state, { id }) => {
  return INITIAL_STATE
  const nodesToDel = R.pipe(
    R.filter(R.propEq("fileId", id)),
    R.values,
    R.map(R.prop("id"))
  )(state.nodes);
  // return state.merge({
  //   nodes: state.nodes.without(nodesToDel),
  //   // agenda: state.nodes.without(nodesToDel),
  //   // agendaResults: state.nodes.without(nodesToDel),
  //   // lastCaptured: state.nodes.without(nodesToDel),
  //   // markedPlaces: state.nodes.without(nodesToDel),
  //   files: state.files.without(id),
  //   tocIds: state.tocIds.without(id)
  // });
};

export const request = state => state.merge({ isBusy: true });

export const success = state => state.merge(withSuccess({}));

export const clearDbSuccess = state => state.merge([INITIAL_STATE]);

export const fileAdded = state => state.merge(withSuccess({}));

export const getOrgDataSuccess = (state, { files, tags }) =>
  state.merge(withSuccess({ files: R.indexBy(R.prop("id"), files), tags }));

export const updateFile = (state, { item }) =>
  state.setIn(["files", item.id], R.merge(state.files[item.id], item));

// * Hookup Reducers To Types

export const reducer = createReducer(INITIAL_STATE, {
  [Types.TOGGLE_MARK]: toggleMark,
  [Types.ADD_TO_LAST_CAPTURED]: addToLastCaptured,
  [Types.ADD_ORG_FILE_REQUEST]: addOrgFileRequest,
  [Types.DELETE_NODES]: deleteNodes,
  [Types.LOAD_DAY_AGENDA]: loadDayAgenda,
  [Types.LOAD_WEEK_AGENDA]: loadWeekAgenda,
  [Types.MERGE_NODE_CHANGES]: mergeNodeChanges,
  [Types.UPDATE_TIMESTAMPS]: updateTimestamps,
  [Types.UPDATE_LOADED_NODES]: updateLoadedNodes,
  [Types.ADD_NOTEBOOK]: addNotebook,
  [Types.DELETE_FILE]: deleteFile,
  [Types.UPDATE_FILE]: updateFile,
  [Types.GET_ORG_DATA_SUCCESS]: getOrgDataSuccess,
  [Types.GET_ORG_DATA_REQUEST]: request,
  [Types.ADD_ORG_FILE_REQUEST]: request,
  [Types.ADD_ORG_FILE_SUCCESS]: fileAdded,
  [Types.CLEAR_DB_REQUEST]: request,
  [Types.CLEAR_DB_SUCCESS]: clearDbSuccess,
  [Types.SYNC_ALL_FILES_REQUEST]: request,
  [Types.SYNC_ALL_FILES_SUCCESS]: success,
  [Types.RESCHEDULE_AGENDA]: rescheduleAgenda,
  [Types.REMOVE_NODES]: removeNodes,
  [Types.LOAD_TOC]: loadToc,
  [Types.UPDATE_FILE_IDS]: updateFileIds,
  [Types.STACK_LOADED]: stackLoaded,
  [Types.SET_MODE]: setMode,
  [Types.CYCLE_MODE]: cycleMode,
  [Types.CLEAR_LAST_ADDED_NODE]: clearLastAddedNode,
  // [Types.MOVE]: move,
  [Types.VISIT_PLACE]: visitPlace,
  [Types.RESET]: reset,
  // [Types.RESET_STACK]: resetStack,
  [Types.UPDATE_ORG_DATA]: updateOrgData,
  // [Types.RUN_NODE_ACTION_REQUEST]: runNodeAction,
  // [Types.UPDATE_NODE]: updateNode,
  [Types.LOAD_RELATED_NODES]: loadRelatedNodes,
  [Types.OPEN_IDS]: openIds,
  [Types.NAVIGATION_STACK_CHANGED]: navigationStackChanged
  // [Types.UPDATE_NODE]: updateNode
});
