import settings from '../settings';

// * SAGAS
// * Imports
import { BackHandler, Keyboard, ToastAndroid } from "react-native";
import RNFS from "react-native-fs";
import {
  all,
  call,
  put,
  select,
  takeLatest,
  throttle,
  takeEvery,
  take
} from "redux-saga/effects";
import { delay, eventChannel, END } from "redux-saga";
import { getFormValues, reset, initialize } from "redux-form";
import DialogAndroid from "react-native-dialogs";
import R from "ramda";
import moment from "moment";

import OrgApi from "org-mode-connection";

import { Colors } from "./themes";
import {
  NavigationActions,
  navigateToOrgElement,
  showEditModal
} from "./navigation";
import { getFileTitle } from "./utils/files";
import { vibrate } from "./vibrations";
import AgendaActions, { AgendaSelectors } from "./redux/AgendaRedux";
import AgendaTransforms, { setTodo } from "./transforms/AgendaTransforms";
import CaptureActions, {
  CaptureTypes,
  CaptureSelectors
} from "./redux/CaptureRedux";
import NavigationRedux, {
  NavigationSelectors,
  NavigationTypes
} from "./redux/NavigationRedux";
import OrgDataRedux, {
  OrgDataTypes,
  OrgDataSelectors
} from "./redux/OrgDataRedux";
import StartupRedux, {
  StartupTypes,
  StartupSelectors
} from "./redux/StartupRedux";
import OrgSearcherFilterRedux, {
  SearchFilterTypes,
  SearchFilterSelectors
} from "./redux/OrgSearcherFilterRedux";
import OrgSearcherRedux, { OrgSearcherTypes } from "./redux/OrgSearcherRedux";
import SyncRedux, { SyncTypes, SyncSelectors } from "./redux/SyncRedux";
import TreeTransforms from "./transforms/TreeTransforms";

// * Tools

export function* alert(title, msg) {
  yield call(DialogAndroid.alert, title, msg);
}

export function* confirmDialog(title, msg) {
  const { action } = yield call(DialogAndroid.alert, title, msg, {
    positiveText: "yes",
    negativeText: "no"
  });

  switch (action) {
    case DialogAndroid.actionPositive:
      return true;
  }
}

export function* textInputDialog(title, msg) {
  const { action, text } = yield call(DialogAndroid.prompt, title, msg, {
    neutralText: "cancel"
  });

  switch (action) {
    case DialogAndroid.actionPositive:
      return text;
    default:
  }
}

// * OrgBrowser sagas

export function* loadNodes(nodesList, stack) {
  yield put(OrgDataRedux.updateLoadedNodes(R.indexBy(R.prop("id"), nodesList)));

  yield put(OrgDataRedux.openIds(nodesList.map(o => o.id), stack));
  yield put(OrgDataRedux.stackLoaded(stack));
}

export function* openOrgFile({ fileId, nodeId }) {
  if (fileId) {
    const { fileData, nodesList } = yield call(
      OrgApi.getFileAsPlainObject,
      fileId
    );
    yield* loadNodes(nodesList);
  }
}

export function* loadRelatedNodes({ nodeId }) {
  const nodesList = yield call(OrgApi.getRelatedNodes, nodeId);

  yield* loadNodes(nodesList);
}

// * OrgApi sagas

function* addOrgFile(action) {
  const { filepath } = action;
  const importedFiles = yield select(OrgDataSelectors.getFiles());
  const canImport = R.pipe(R.filter(file => file.path === filepath), R.isEmpty)(
    importedFiles
  );
  if (canImport) {
    DialogAndroid.showProgress(`Importing ${filepath} ...`, {
      style: DialogAndroid.progressHorizontal // omit this to get circular
    });

    const res = yield call(OrgApi.importFile, filepath);
    yield put(OrgDataRedux.getOrgDataRequest());
    yield call(DialogAndroid.dismiss);
  } else {
    DialogAndroid.alert("File is already imported.");
  }
}

export function* getExternallyChangedFiles() {
  const mTimes = yield call(OrgApi.getExternallyChangedFiles);
  yield put(
    SyncRedux.updateExternallyChangedFilesSuccess(
      R.indexBy(R.prop("id"), mTimes)
    )
  );
}

export function* afterSync() {
  // TODO refactor load orgdate to individual files
  // Reload toc for synced files
  // Reload tags
  // Cloase stacks
  // Close old windows

  yield* loadOrgData(false);
  yield put(SyncRedux.updateExternallyChangedFilesRequest());
}

export function* syncFile({ id }) {
  const file = yield select(OrgDataSelectors.getFile(id));
  const fileName = getFileTitle(file);
  DialogAndroid.showProgress(`Synchronizing ${fileName} ...`, {
    style: DialogAndroid.progressHorizontal // omit this to get circular
  });
  const results = yield call(OrgApi.syncFile, id);
  yield call(DialogAndroid.dismiss);
  yield put(SyncRedux.syncFileSuccess(id));
  // console.tron.log(results)
  yield call(
    ToastAndroid.show,
    `File ${file.path} synced successfully`,
    ToastAndroid.LONG
  );
}

function* syncAllFiles() {
  const filesData = yield select(OrgDataSelectors.getFiles);
  const a = yield select(SyncSelectors.getExternallyChangedFiles);
  const b = yield select(SyncSelectors.getChangedFiles);
  const ids = R.pipe(
    R.symmetricDifference,
    R.filter(id => filesData[id].path !== null)
  )(R.keys(a), R.keys(b));

  // TODO close opened search od other opened thingd
  for (var i = 0; i < ids.length; i++) {
    const id = ids[i];
    yield* syncFile({ id });
  }

  if (ids.length > 0) {
    yield* afterSync();
  }
}

// function* removeOrgFile(action) {
//   const { path } = action;
// }

function* clearDb() {
  yield call(OrgApi.clearDb);
  yield put(OrgDataRedux.reset());
  yield put(OrgDataRedux.clearDbSuccess());
}

export function* loadPinnedNodes() {
  const pinned = yield call(OrgApi.search, {
    todos: {},
    tags: { PIN: 1 },
    priority: {},
    isScheduled: false,
    hasDeadline: false,
    searchTerm: ""
  });

  yield put(
    OrgDataRedux.updateLoadedNodes(
      R.indexBy(R.prop("id"), pinned),
      "markedPlaces"
    )
  );

  yield put(OrgDataRedux.openIds(pinned.map(o => o.id), "markedPlaces"));
}

function* loadOrgData(updateChangedFiles = true) {
  const files = yield call(OrgApi.getAllFilesAsPlainObject);
  const tags = yield call(OrgApi.getTagsAsPlainObject);
  const tocs = yield call(OrgApi.getTocs);

  // Load Files and Tags
  yield put(
    OrgDataRedux.getOrgDataSuccess(
      R.map(R.omit(["nodesData", "isChanged"]), files),
      tags
    )
  );

  // Rehydrate locally changed files
  if (updateChangedFiles) {
    const changedFiles = R.into(
      [],
      R.compose(R.filter(R.propEq("isChanged", true)), R.map(file => file.id)),
      files
    );

    yield put(SyncRedux.markAsChanged(changedFiles));
  }
  // Load TOCS
  for (var i = 0; i < files.length; i++) {
    const fileId = files[i].id;
    yield put(OrgDataRedux.updateFileIds(fileId, null, tocs.ids[fileId]));
    yield put(OrgDataRedux.updateLoadedNodes(tocs.data));
  }

  // Load Pinned Nodes
  yield* loadPinnedNodes();
  yield put(OrgDataRedux.loadWeekAgenda(new Date()));
}

function* search({ query }) {
  const results = yield call(OrgApi.search, query);
  yield* loadNodes(results, "searchResults");
  // yield put(OrgSearcherRedux.searchSuccess());
}

export function* markPlace({ nodeId, placeId }) {}

// * Startup sagas

export function* startup(action) {
  if (__DEV__ && console.tron) {
    // straight-up string logging
    console.tron.log("orgAssistant has started!");
  }

  /* ------------- Load readme if is first run ------------- */

  const firstRun = yield select(StartupSelectors.isFirstRun);
  if (firstRun) {
    const res = yield call(RNFS.readFileAssets, "org/readme.org", "utf8");
    yield call(OrgApi.createFileFromString, "readme.org", res.split("\n"));
  }
  yield put(OrgDataRedux.getOrgDataRequest());
  yield put(StartupRedux.startupFinished());
}

// * Nodes interactions sagas

export function* updateNodesAgenda(ids, num, interval, type) {
  const actions = [];
  const nodes = yield select(OrgDataSelectors.getNodes());
  const updatedNodes = [];
  for (var i = 0; i < ids.length; i++) {
    const n = AgendaTransforms.move(num, interval)(nodes[ids[i]], type);
    updatedNodes.push(n);
  }

  yield put(OrgDataRedux.mergeNodeChanges(updatedNodes, ids))

  for (var i = 0; i < ids.length; i++) {
    const n = updatedNodes[i];
    yield call(OrgApi.updateNodeById, n.id, prepareNoteForDb(n))
  }

  yield* markFilesAsChanged(ids)

  // console.tron.log(updatedNodes)
  // yield put(updatedNodes.map(n=> OrgApi.updateNodeById(n.id, n)))

  // FIXME batch updates are not working
  // console.tron.warn(actions)
  // yield put([{type: 'sdf'}, ...actions]);
}

export function* moveNode(
  direction,
  ids,
  navigationStack,
  withDescendants = true
) {
  // TODO do updates to all stacks with this fileId
  // In this moment we are sorting only stack when the changes occured

  const loadedNodesData = yield select(OrgDataSelectors.getNodes);
  let loadedNodesIds = yield select(OrgDataSelectors.getLoadedNodesIds);
  loadedNodesIds = loadedNodesIds[navigationStack];

  /* ------------- compute changes ------------- */
  let changes = yield call(
    TreeTransforms.move,
    {
      loadedNodesData,
      loadedNodesIds
    },
    {
      movedNodeId: ids[0],
      direction,
      withDescendants
    }
  );

  if (changes.length === 0) return;

  const fileId = changes[0].fileId;
  const changesDict = R.indexBy(R.prop("id"), changes);

  /* ------------- update data ------------- */
  yield put(OrgDataRedux.updateLoadedNodes(changesDict));

  /* ------------- reorder ids ------------- */
  const newIds = R.sortBy(
    id =>
      changesDict[id] ? changesDict[id].position : loadedNodesData[id].position,
    loadedNodesIds
  );

  const newTOC = R.pipe(
    R.filter(
      id =>
        changesDict[id]
          ? changesDict[id].level === 1
          : loadedNodesData[id].level === 1
    )
  )(newIds);

  yield put(OrgDataRedux.updateFileIds(fileId, newIds, newTOC));

  yield* markFilesAsChanged([ids[0]])

  /* ------------- update realm database ------------- */

  for (var i = 0; i < changes.length; i++) {
    yield call(
      OrgApi.updateNodeById,
      changes[i].id,
      R.pick(["position", "level"], changes[i])
    );
  }
}

const agendaButtons = [
  {
    title: "S",
    showAsAction: "always"
  },
  {
    title: "D",
    showAsAction: "always"
  },
  {
    title: "+2d",
    showAsAction: "always"
  },

  {
    title: "+1d",
    showAsAction: "always"
  },
  {
    title: "NOW",
    showAsAction: "always"
  }
];

export function* runNodeAction({
  actionName,
  ids,
  navigator,
  node,
  navigationStack,
  doAfterAction,
  doBeforeAction,
  payload
}) {
  let res;
  let channel;
  // When capture node is fetched from capture form
  if (navigationStack === "capture") {
    node = yield select(getFormValues("capture"));
  }
  // console.tron.warn(node);

  switch (actionName) {
    /* ------------- capture actions ------------- */

    case "showCaptureSideMenu":
      const ct = yield select(getFormValues("capture"));
      channel = eventChannel(emitter => {
        navigator.showContextualMenu({
          rightButtons: [
            {
              title: "Save",
              showAsAction: "always"
            },
            {
              title: "Save as",
              showAsAction: "always"
            }
          ],
          onButtonPressed: index => {
            emitter({ index });
            emitter(END);
          }
        });
        return () => {};
      });

      while (true) {
        const { index } = yield take(channel);
        switch (index) {
          case 0:
            yield* saveCaptureTemplate({
              target: ct
            });

            navigator.showSnackbar({
              text: `Capture template ${ct.name} saved succesfully`,
              textColor: Colors.white, // optional
              backgroundColor: Colors.button, // optional
              duration: "short" // default is `short`. Available options: short, long, indefinite
            });
            break;
          case 1:
            yield* addCaptureTemplate({
              target: ct
            });
            navigator.showSnackbar({
              text: `Capture template ${ct.name} added succesfully`,
              textColor: Colors.white, // optional
              backgroundColor: Colors.button, // optional
              duration: "short" // default is `short`. Available options: short, long, indefinite
            });
            break;
        }
      }
      break;

    /* ------------- agenda actions ------------- */

    case "addToAgenda":
      navigator.handleDeepLink({
        link: `capture`,
        payload: {
          type: "agendaCapture",
          date: payload.date
        }
      });
      break;

    case "moveToTomorrow":
      // console.tron.log(node)
      // HACK z agendy dochodzi dodatkkowy prop do noda "type"
      // pojawia sie tam bo nie ma jak inaczej przesłac tych danych
      // tzn można ale wymaga to zbyt dóżej liczby przeróbek
      // nie wiadomo jakie bugi spowoduje

      yield put(
        OrgDataRedux.updateNode(
          AgendaTransforms.move(1, "d")(node, node.type),
          ids
        )
      );
      break;

    case "moveToYesterday":
      yield put(
        OrgDataRedux.updateNode(
          AgendaTransforms.move(-1, "d")(node, node.type),
          ids
        )
      );
      break;

    case "agenda":
      channel = eventChannel(emitter => {
        navigator.showContextualMenu({
          rightButtons: agendaButtons,
          onButtonPressed: index => {
            emitter({ index });
            emitter(END);
          }
        });
        return () => {};
      });

      while (true) {
        const { index } = yield take(channel);
        switch (index) {
          case 0:
            // Schedule
            doBeforeAction && doBeforeAction();
            showEditModal(navigator, {
              nodesIds: ids,
              node,
              editField: "timestamps",
              type: "schedule",
              title: "Schedule",
              navigationStack,
              onExit: doAfterAction
            });
            break;
          case 1:
            // Deadline
            doBeforeAction && doBeforeAction();
            showEditModal(navigator, {
              nodesIds: ids,
              node,
              editField: "timestamps",
              type: "deadline",
              title: "Deadline",
              navigationStack,
              onExit: doAfterAction
            });
            break;
          case 2:
            // +2d
            yield* updateNodesAgenda(ids, 2, "d", "scheduled");
            break;
          case 3:
            // +1d

            yield* updateNodesAgenda(ids, 1, "d", "scheduled");
            break;
          case 4:
            // .

            yield* updateNodesAgenda(ids, 0, "d", "scheduled");
            break;
        }
      }
      break;
    /* ------------- move in tree structure ------------- */

    case "moveUp":
      yield* moveNode("up", ids, navigationStack);
      break;

    case "moveDown":
      yield* moveNode("down", ids, navigationStack);
      break;

    case "moveLeft":
      yield* moveNode("left", ids, navigationStack);
      break;

    case "moveRight":
      yield* moveNode("right", ids, navigationStack);
      break;

    case "moveUpNote":
      yield* moveNode("up", ids, navigationStack, false);
      break;

    case "moveDownNote":
      yield* moveNode("down", ids, navigationStack, false);
      break;

    case "moveLeftNote":
      yield* moveNode("left", ids, navigationStack, false);
      break;

    case "moveRightNote":
      yield* moveNode("right", ids, navigationStack, false);
      break;

    /* ------------- edit actions ------------- */

    case "delete":
      res = yield* confirmDialog(
        "Delete",
        `Really delete ${ids.length} nodes?`
      );
      if (res) {
        for (var i = 0; i < ids.length; i++) {
          NavigationActions.popScreens({ nodeId: ids[i] });
          yield call(OrgApi.deleteNodeById, ids[i]);
        }
        yield* markFilesAsChanged(ids);
        yield put(OrgDataRedux.removeNodes(ids));
        yield put(OrgDataRedux.deleteNodes(ids));
        doAfterAction && doAfterAction();
      }
      break;

    case "todo":
      doBeforeAction && doBeforeAction();
      showEditModal(navigator, {
        nodesIds: ids,
        node,
        editField: "todo",
        title: "Select todos",
        navigationStack,
        onExit: doAfterAction
      });
      break;

    case "cycleTodoState":
      if (node.todo && node.todo !== "DONE") {
        yield put(
          OrgDataRedux.updateNode(R.merge(node, setTodo("DONE", node)), ids)
        );
      } else {
        showEditModal(navigator, {
          nodesIds: ids,
          node,
          editField: "todo",
          title: "Select todos state",
          navigationStack,
          onExit: doAfterAction
        });
      }
      break;

    case "edit":
      doBeforeAction && doBeforeAction();
      navigator.handleDeepLink({
        link: `capture/visitedNode`,
        payload: {
          targetNode: node,
          type: "edit",
          navigationStack
        }
      });
      break;

    case "tags":
      doBeforeAction && doBeforeAction();
      showEditModal(navigator, {
        nodesIds: ids,
        node,
        editField: "tags",
        title: "Select tags",
        navigationStack,
        onExit: doAfterAction
      });
      break;

    case "priority":
      doBeforeAction && doBeforeAction();
      showEditModal(navigator, {
        nodesIds: ids,
        node,
        editField: "priority",
        title: "Select priority",
        navigationStack,
        onExit: doAfterAction
      });
      break;
  }
}

// * Navigation sagas

export function* markFilesAsChanged(nodesIds) {
  const nodesData = yield select(OrgDataSelectors.getNodes);
  const changedFilesIds = R.pipe(R.map(id => nodesData[id].fileId), R.uniq)(
    nodesIds
  );

  yield put(SyncRedux.markAsChanged(changedFilesIds));
}

export function* openCaptureScreen({ navigator, fileId, nodeId }) {
  // navigator.showSnackbar({
  //   text: 'Hello from Snackbar',
  //   actionText: 'done', // optional
  //   actionId: 'fabClicked', // Mandatory if you've set actionText
  //   actionColor: 'green', // optional
  //   textColor: 'red', // optional
  //   backgroundColor: 'blue', // optional
  //   duration: 'indefinite' // default is `short`. Available options: short, long, indefinite
  // });

  // navigator.switchToTab({
  //   tabIndex: 2,
  //   passProps: {
  //     message: 'fupa',
  //     fileId,
  //     nodeId
  //   }
  // })

  const data = {
    id: "node is",
    headline: "added node",
    content: "",
    tags: [],
    level: 1,
    position: 0
  };
  yield put(CaptureActions.captureSuccess(data));
}

const prepareNoteForDb = R.evolve({
  drawers: (drawers) => typeof drawers === 'object' ? JSON.stringify(drawers) : drawers,
  tags: R.map(tag => ({ name: tag, isContextTag: false }))
});

export function* updateNode({ node, nodesIds, isNew = false }) {
  // HACK because node sent from capture or edit   donot has no nodesIds
  const updateActions = [];

  if (node.id) nodesIds = [node.id];

  /* ------------- get changes ------------- */

  let changes;
  if (nodesIds.length === 1 && !isNew) {
    // Its comming from edit screen and it icontains whole node
    // we have to compute diff
    const id = nodesIds[0];
    const originalNode = yield select(OrgDataSelectors.getNode(id));
    changes = R.pipe(
      R.useWith(R.difference, [R.toPairs, R.toPairs]),
      R.fromPairs
    )(node, originalNode);
  } else {
    changes = node;
  }

  if (changes.timestamps) {
    /* ------------- timestamps rehydrate ------------- */
    // When clear is set at datetime modal date is set to undefined
    // It should be filtered out
    changes = {
      ...changes,
      timestamps: changes.timestamps.filter(ts => ts.date != undefined)
    };

    updateActions.push(OrgDataRedux.mergeNodeChanges(changes, nodesIds));
    // console.tron.log("TS CHANGE");
    // console.tron.warn(changes);
    updateActions.push(OrgDataRedux.rescheduleAgenda(changes, nodesIds));
    yield put(updateActions);
    const timestamps = R.concat(
      yield select(OrgDataSelectors.getTimestamps),
      yield select(OrgDataSelectors.getDayTimestamps)
    );

    yield put(
      OrgDataRedux.openIds(timestamps.map(ts => ts.nodeId), "agenda")
    );
    // jesli nod jest załadowany do agendy
    // usunąć wszystkie datestampy
    // dodać nowe jeśli się mieszczą w rangu
  } else {
    updateActions.push(OrgDataRedux.mergeNodeChanges(changes, nodesIds));
    yield put(updateActions);
  }

  /* ------------- Update Files ------------- */

  yield* markFilesAsChanged(nodesIds);

  /* ------------- Update realm database ------------- */

  const preparedNode = prepareNoteForDb(node);
  // console.tron.log(preparedNode);

  for (var i = 0; i < nodesIds.length; i++) {
    yield call(OrgApi.updateNodeById, nodesIds[i], preparedNode);
  }
}

export function* cancelCapture({ navigator }) {
  const navigationStackHistory = yield select(
    OrgDataSelectors.navigationStackHistory
  );
  if (navigationStackHistory[0] !== "capture") return;

  const link =
    navigationStackHistory.length > 1 ? navigationStackHistory[1] : "notes";
  // vibrate();
  Keyboard.dismiss();
  // yield delay(100);
  // yield put(reset('capture'))
  yield call(navigator.handleDeepLink, { link });
}

export function* confirmCapture({ navigator }) {
  const { target, name, ...node } = yield select(getFormValues("capture"));

  const type = node.id ? "edit" : "new";
  const navigationStackHistory = yield select(
    OrgDataSelectors.navigationStackHistory
  );

  const link =
    navigationStackHistory.length > 1 ? navigationStackHistory[1] : "notes";

  let addedNode;

  switch (type) {
    case "edit":
      yield put(OrgDataRedux.updateNode(node, [node.id], link));
      break;

    case "new":
      addedNode = (yield call(OrgApi.addNodes, [prepareNoteForDb(node)], {
        ...target
      }))[0];

      // yield put(OrgDataRedux.updateNode(addedNode));
      yield* updateNode({ node: addedNode, isNew: true });

      // TODO zbatchować akcje, aby uniknę wielokrotych updatów
      const fileNodes = yield select(
        OrgDataSelectors.getFileNodes(addedNode.fileId)
      );

      // Update idików - dzieje się tylko przy dodawaniu a nie przy updacie
      // Inna sprawa to timestampy - one mogą się zmieniac przy updacie więc spadaje do updateNode
      const newIds = R.pipe(
        R.values,
        R.sortBy(R.prop("position")),
        R.map(R.prop("id"))
      )(fileNodes);
      const newTOC = R.pipe(
        R.filter(R.propEq("level", 1)),
        R.map(R.prop("id"))
      )(fileNodes);
      yield put([
        OrgDataRedux.addToLastCaptured(addedNode),
        OrgDataRedux.updateFileIds(addedNode.fileId, newIds, newTOC)
      ]);
  }

  // yield call(navigator.handleDeepLink, { link: navigationStack });
  // yield delay(200);
  yield call(navigator.handleDeepLink, { link });

  /* ------------- Create success message ------------- */

  let message;

  if (type === "edit") {
    message = "Edited note saved succesfully.";
  } else if (type === "add" && name) {
    message = `Added note to ${name}.`;
  } else {
    message = "Added note.";
  }

  yield call(navigator.showSnackbar, {
    text: message,
    // actionText: "done", // optional
    // actionId: "fabClicked", // Mandatory if you've set actionText
    // actionColor: "green", // optional
    textColor: Colors.bg, // optional
    backgroundColor: Colors.primary, // optional
    duration: "short" // default is `short`. Available options: short, long, indefinite
  });
  // yield* syncAllFiles();
}

let backHandlerFix;

export function* manageBackHandlerFIX({ fileId, nodeId, navigationStack }) {
  // HACK Bug in react_native_navigation navigation screen visiblility event are not fired when using shared trransition
  if (navigationStack != "notes") return;

  if (!fileId) {
    if (!nodeId) {
      yield put(OrgDataRedux.resetStack("NotesScreen"));
      try {
        backHandlerFix.remove();
      } catch (err) {
      } finally {
      }
      backHandlerFix = BackHandler.addEventListener("hardwareBackPress", () => {
        return true;
      });
    }
  } else {
    backHandlerFix.remove();
  }
}

export function* manageBackHandlerFIXremoveBackHandlers({ to }) {
  // console.tron.log("sdfsdf" );

  try {
    backHandlerFix.remove();
  } catch (err) {
  } finally {
  }
}

export function* loadTOC({ fileId, navigator }) {
  // Update loaded nodes data with cached level one nodes
  // For faster loading
  vibrate();
  // const { toc } = yield select(OrgDataSelectors.getFile(fileId));
  // yield put(OrgDataRedux.openIds(toc));
  yield call(navigator.handleDeepLink, { link: `notes/${fileId}` });
}

// * CaptureTemplates

export function* rehydrateNewNodeCache(node) {
  // TODO zbatchować akcje, aby uniknę wielokrotych updatów

  yield* updateNode({ node });
  const fileNodes = yield select(OrgDataSelectors.getFileNodes(node.fileId));

  // fileNodes.push(node)

  // Update idików - dzieje się tylko przy dodawaniu a nie przy updacie
  // Inna sprawa to timestampy - one mogą się zmieniac przy updacie więc spadaje do updateNode
  const newIds = R.pipe(
    R.values,
    R.sortBy(R.prop("position")),
    R.map(R.prop("id"))
  )(fileNodes);
  const newTOC = R.pipe(R.filter(R.propEq("level", 1)), R.map(R.prop("id")))(
    fileNodes
  );
  yield put(OrgDataRedux.updateFileIds(node.fileId, newIds, newTOC));
}

function* getOrCreateNode(target) {
  const [node, created] = yield call(OrgApi.getOrCreateNodeByHeadline, target);
  if (created) {
    yield* rehydrateNewNodeCache(node);
  }
  return node.id;
}

// Creates breadcrumbs - has wrong name
export function* loadBreadcrumbs({ target }) {
  let file;
  let nodeId;
  let ancestors = [];

  file = yield select(OrgDataSelectors.getFile(target.fileId));

  if (target.nodeId || target.headline) {
    // nodeId = yield call(OrgApi.getOrCreateNodeByHeadline, target);
    const nodeId = yield* getOrCreateNode(target);
    ancestors = yield call(OrgApi.getAncestorsAsPlainObject, nodeId);
  }

  yield put(
    NavigationRedux.updateNavigation({
      breadcrumbs: [
        {
          fileId: target.fileId,
          headline: getFileTitle(file)
        },
        ...R.map(R.pick(["id", "headline"]), ancestors)
      ]
    })
  );
}

export function* selectCaptureTemplate({ id }) {
  let ct;

  // Null is used when adding to note to currently visited node
  if (id !== null) {
    ct = yield select(CaptureSelectors.captureTemplate(id));
    yield put(NavigationRedux.loadBreadcrumbs(ct.target));
    // yield put(NavigationRedux.selectCaptureTemplate())
  } else {
    ct = yield select(getFormValues("capture"));
  }

  // Agenda Capture
  const cType = yield select(NavigationSelectors.getCaptureType);
  switch (cType) {
    case "agendaCapture":
      const date = yield select(AgendaSelectors.getSelectedDay);
      ct = R.merge(ct, {
        timestamps: [
          {
            type: "scheduled",
            date
          }
        ]
      });
      break;
  }

  yield put(initialize("capture", ct));
}

export function* showSavedSearchesActions({ item }) {
  vibrate();

  const { action, selectedItem } = yield call(
    DialogAndroid.showPicker,
    `Select Action for "${item.name}":`,
    null,
    {
      positiveText: "",
      items: [
        { label: "Rename", id: "rename" },
        { label: "Delete", id: "delete" }
      ]
    }
  );

  if (selectedItem)
    switch (selectedItem.id) {
      case "rename":
        const userInput = yield* textInputDialog(
          "Rename search",
          `Enter new name for search "${item.name}"`
        );
        if (userInput) {
          const exists = yield select(
            SearchFilterSelectors.itemExists(userInput)
          );

          if (!exists) {
            yield put(OrgSearcherFilterRedux.renameQuery(item.name, userInput));
          } else {
            const { action, text } = yield call(
              DialogAndroid.alert,
              "Rename capture template",
              `Capture template named "${userInput}" already exists. Do you want to overwrite it ?`,
              {
                positiveText: "Yes",
                negativeText: "No"
              }
            );
            if (action === DialogAndroid.actionPositive) {
              yield put(OrgSearcherFilterRedux.deleteQuery(userInput));
              yield put(
                OrgSearcherFilterRedux.renameQuery(item.name, userInput)
              );
            }
          }
        }
        break;
      case "delete":
        const { action } = yield call(
          DialogAndroid.alert,
          "Delete",
          `Do you really want to delete "${item.name}" query`,
          {
            positiveText: "yes",
            negativeText: "no"
          }
        );

        switch (action) {
          case DialogAndroid.actionPositive:
            yield put(OrgSearcherFilterRedux.deleteQuery(item.name));
            break;
          default:
        }
        break;
      default:
    }
}

export function* showCaptureTemplateActions({ item, action }) {
  vibrate();
  let actionId;

  if (action) {
    actionId = action;
  } else {
    const { selectedItem } = yield call(
      DialogAndroid.showPicker,
      `Select Action for "${item.name}":`,
      null,
      {
        positiveText: "",
        items: [
          { label: "Rename", id: "rename" },
          { label: "Delete", id: "delete" }
        ]
      }
    );

    if (selectedItem) {
      actionId = selectedItem.id;
    }
  }

  switch (actionId) {
    case "rename":
      const userInput = yield* textInputDialog(
        "Rename capture template",
        `Enter new name for capture template "${item.name}"`
      );
      if (userInput) {
        const exists = yield select(
          CaptureSelectors.captureTemplateExists(userInput)
        );

        if (!exists) {
          yield put(
            CaptureActions.addCaptureTemplate(
              userInput,
              item.target,
              R.omit(["target", "name"], item)
            )
          );
          yield put(CaptureActions.deleteCaptureTemplate(item.name));
        } else {
          const { action, text } = yield call(
            DialogAndroid.alert,
            "Rename capture template",
            `Capture template named "${userInput}" already exists. Do you want to overwrite it ?`,
            {
              positiveText: "Yes",
              negativeText: "No"
            }
          );
          if (action === DialogAndroid.actionPositive) {
            yield put(
              CaptureActions.addCaptureTemplate(
                userInput,
                item.target,
                R.omit(["target", "name"], item)
              )
            );
            yield put(CaptureActions.deleteCaptureTemplate(item.name));
          }
        }
      }
      break;

    case "delete":
      let { action } = yield call(
        DialogAndroid.alert,
        "Delete",
        `Do you really want to delete "${item.name}" capture template `,
        {
          positiveText: "yes",
          negativeText: "no"
        }
      );

      switch (action) {
        case DialogAndroid.actionPositive:
          yield put(CaptureActions.deleteCaptureTemplate(item.name));
          break;
        default:
      }
      break;
    default:
  }
}

export function* saveCaptureTemplate({ target, after }) {
  let ctTarget;
  let ctContent;
  let ctName;
  if (target.target) {
    // this is whole capture form to update
    ctTarget = target.target;
    ctContent = R.omit(["target", "name"], target);
    ctName = target.name;
  } else {
    // Only target for new template
    ctTarget = target;
    ctContent = {};
  }

  yield put(CaptureActions.addCaptureTemplate(ctName, ctTarget, ctContent));
}

export function* addCaptureTemplate({ target, after }) {
  let ctTarget;
  let ctContent;
  let ctName;
  if (target.target) {
    // this is whole capture form to update
    ctTarget = target.target;
    ctContent = R.omit(["target", "name"], target);
    ctName = target.name;
  } else {
    // Only target for new template
    ctTarget = target;
    ctContent = {};
  }
  const { action, text } = yield call(
    DialogAndroid.prompt,
    "Add Capture Template",
    "Enter name for new capture template:",
    {
      neutralText: "Cancel"
    }
  );

  switch (action) {
    case DialogAndroid.actionPositive:
      if (R.isNil(text)) {
        yield call(DialogAndroid.alert, "Add Capture Template", "Empty name");
      } else {
        const exists = yield select(
          CaptureSelectors.captureTemplateExists(text)
        );
        if (!exists) {
          yield put(
            CaptureActions.addCaptureTemplate(text, ctTarget, ctContent)
          );
          NavigationActions.showSnackbar(
            `Added capture template with name ${text}`
          );
        } else {
          const { action } = yield call(
            DialogAndroid.alert,
            "Add Capture Template",
            `Capture template named "${text}" already exists. Do you want to overwrite it ?`,
            {
              positiveText: "Yes",
              negativeText: "No"
            }
          );
          if (action === DialogAndroid.actionPositive) {
            yield put(
              CaptureActions.addCaptureTemplate(text, ctTarget, ctContent)
            );

            NavigationActions.showSnackbar(
              `Added capture template with name ${text}`
            );
          }
        }
      }
      break;
    default:
  }
  after && after();
}

// * Files

export function* deleteFile(file) {
  DialogAndroid.showProgress(`Deleting ${file.id} ...`, {
    style: DialogAndroid.progressHorizontal // omit this to get circular
  });

  yield put(CaptureActions.deleteCaptureTemplatesOfFile(file.id));
  yield put(SyncRedux.syncFileSuccess(file.id)); // Removes files statuses
  yield put(OrgDataRedux.deleteFile(file.id));
  yield call(OrgApi.deleteFileById, file.id);
  yield put(OrgDataRedux.getOrgDataRequest());

  DialogAndroid.dismiss();
}

export function* showFileActionsDialog({ item }) {
  vibrate();
  let actions = [
    { label: "Rename", id: "rename" },
    { label: "Delete", id: "delete" }
  ];

  if (item.path) {
    actions = actions.concat([
      { label: "Force load", id: "forceLoadFile" },
      { label: "Force write", id: "forceWrite" }
    ]);
  } else {
    actions = actions.concat([{ label: "Export", id: "export" }]);
  }

  const { action, selectedItem } = yield call(
    DialogAndroid.showPicker,
    `Select Action:`,
    null,
    {
      positiveText: "",
      items: actions
    }
  );

  if (selectedItem) {
    let res;
    switch (selectedItem.id) {
      case "forceLoadFile":
        res = yield* confirmDialog(
          "Force load",
          "Local changes will be forgotten. Do you really want to reload file?"
        );
        if (res) {
          yield* deleteFile(item);
          yield* addOrgFile({ filepath: item.path });
        }
        break;

      case "export":
        DialogAndroid.alert(
          "Export functionality in not available in this version of app."
        );
        break;

      case "rename":
        const userInput = yield* textInputDialog(
          "Rename Notebook",
          `Enter new name for notebook "${item.metadata.TITLE}"`
        );
        if (userInput) {
          let renamedItem = R.assocPath(["metadata", "TITLE"], userInput, item);
          renamedItem.isChanged = true;
          yield put(OrgDataRedux.updateFile(renamedItem));
          yield call(
            OrgApi.updateFile,
            renamedItem.id,
            R.omit(["id", "toc", "nodesData"], renamedItem)
          );
        }
        break;

      case "delete":
        res = yield* confirmDialog(
          "Delete",
          "Do you really want to delete file?"
        );
        if (res) yield* deleteFile(item);

        break;
      default:
    }
  }
}

export function* addNotebook(action) {
  const res = yield* textInputDialog("Add notebook", "Enter name of notebook");
  if (res) {
    const files = yield select(OrgDataSelectors.getFiles);
    const fileWithThisName = R.find(
      R.pathEq(["metadata", "TITLE"], res),
      R.values(files)
    );

    if (fileWithThisName) {
      yield* alert("Error", `File with name "${res}" already exists.`);
    } else {
      const newFile = yield call(OrgApi.addFile, res);
      yield* loadOrgData();
    }
    // console.tron.log(newFile);
    // put(OrgDataRedux.addNotebook(res));
  }
}

export function* visitCaptureTemplate({ item: { target }, navigator }) {
  let ctNodeId;
  if (target.headline) {
    const nodeId = yield* getOrCreateNode(target);
    ctNodeId = nodeId;
  }

  const props = {
    screen: "OrgFileBrowserScreen",
    passProps: {
      fileId: target.fileId,
      nodeId: ctNodeId,
      foldingLevel: 1,
      contentFoldingLevel: 1,
      navigationStack: "notes"
    }
  };

  navigator.push(props);
}

export function* saveSearch() {
  let name = yield* textInputDialog("Save search query", "Enter name:");
  if (!R.isNil(name)) {
    const savedQueries = yield select(SearchFilterSelectors.savedItems);
    const nameExists = R.find(R.propEq("name", name), savedQueries);
    if (nameExists) {
      name = yield* alert(
        "Save search query",
        `Search query with name '${name}' already exists.`
      );
    } else {
      yield put(OrgSearcherFilterRedux.saveSearchQuerySuccess(name));
      vibrate();
      NavigationActions.showSnackbar(
        `Search query was saved with name '${name}'`
      );
    }
  }
}

export function* toggleMark({ node }) {
  if (node) {
    let tags;
    if (node.tags.includes("PIN")) {
      tags = R.without(["PIN"], node.tags);
    } else {
      tags = R.concat(node.tags, ["PIN"]);
    }
    yield put(OrgDataRedux.updateNode({ tags }, [node.id]));
  }
  // yield* loadPinnedNodes();
}

export function* loadAgenda(action) {
  const range = yield select(OrgDataSelectors.getTimestampsRange);
  // console.tron.warn(range);
  const { agendaItems, dayAgendaItems, nodes } = yield call(
    OrgApi.getAgendaAsPlainObject,
    range
  );
  // Load Agenda
  // FIXME pojawiają się timestampy nie powiązanie z nodami
  // Nie powinny się pokazywac problem leży gdzieś w orm-mode-connection
  yield* loadNodes(nodes, "agenda");
  yield put(OrgDataRedux.updateTimestamps(agendaItems, dayAgendaItems, range));
  // yield put(OrgDataRedux.updateTimestamps(agendaItems.datTimestamps, range));
  // console.tron.log(currentWeek.start.format('dddd'))
  // console.tron.log(currentWeek.end.format('dddd'))
}

// * Connect types to sagas

export default function* root() {
  yield all([
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup),

    /* ------------- data ------------- */

    // org data
    takeLatest(OrgDataTypes.GET_ORG_DATA_REQUEST, loadOrgData),
    takeLatest(OrgDataTypes.ADD_ORG_FILE_REQUEST, addOrgFile),
    takeLatest(OrgDataTypes.ADD_NOTEBOOK_REQUEST, addNotebook),
    takeLatest(OrgDataTypes.CLEAR_DB_REQUEST, clearDb),
    takeLatest(OrgDataTypes.SYNC_ALL_FILES_REQUEST, syncAllFiles),
    takeLatest(
      SyncTypes.UPDATE_EXTERNALLY_CHANGED_FILES_REQUEST,
      getExternallyChangedFiles
    ),
    takeLatest(OrgDataTypes.SHOW_FILE_ACTIONS_DIALOG, showFileActionsDialog),

    /* ------------- browser ------------- */

    takeLatest(
      OrgDataTypes.NAVIGATION_STACK_CHANGED,
      manageBackHandlerFIXremoveBackHandlers
    ),

    takeLatest(NavigationTypes.LOAD_BREADCRUMBS, loadBreadcrumbs),

    takeLatest(OrgDataTypes.VISIT_PLACE, manageBackHandlerFIX),
    takeLatest(OrgDataTypes.OPEN_FILE_REQUEST, openOrgFile),
    takeLatest(OrgDataTypes.LOAD_RELATED_NODES, loadRelatedNodes),
    takeLatest(OrgDataTypes.UPDATE_NODE, updateNode),
    takeLatest(OrgDataTypes.LOAD_TOC, loadTOC),
    takeLatest(OrgDataTypes.RUN_NODE_ACTION_REQUEST, runNodeAction),
    takeLatest(OrgDataTypes.TOGGLE_MARK, toggleMark),
    takeLatest(OrgDataTypes.LOAD_WEEK_AGENDA, loadAgenda),
    takeLatest(OrgDataTypes.LOAD_DAY_AGENDA, loadAgenda),

    /* ------------- capture ------------- */

    takeLatest(CaptureTypes.VISIT_CAPTURE_TEMPLATE, visitCaptureTemplate),
    takeLatest(
      NavigationTypes.SELECT_CAPTURE_TEMPLATE_REQUEST,
      selectCaptureTemplate
    ),
    takeLatest(CaptureTypes.CONFIRM, confirmCapture),
    takeLatest(CaptureTypes.ADD_CAPTURE_TEMPLATE_REQUEST, addCaptureTemplate),
    takeEvery(CaptureTypes.CANCEL_CAPTURE, cancelCapture),
    takeLatest(
      CaptureTypes.SHOW_CAPTURE_TEMPLATE_ACTIONS,
      showCaptureTemplateActions
    ),

    /* ------------- search ------------- */

    takeLatest(
      OrgSearcherTypes.SHOW_SAVED_SEARCHES_ACTIONS,
      showSavedSearchesActions
    ),
    // takeLatest(CaptureTypes.CAPTURE_TEMPLATE_ACTION, captureTemplateAction),
    takeLatest(OrgSearcherTypes.SEARCH, search),
    takeLatest(SearchFilterTypes.SAVE_SEARCH_QUERY_REQUEST, saveSearch)
    // takeLatest(OrgSearcherTypes.OPEN_SEARCH_RESULT, openOrgFile),
  ]);
}
