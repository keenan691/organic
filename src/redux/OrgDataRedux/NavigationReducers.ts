// * NavigationReducers.ts

// ** License

/**
 * Copyright (C) 2018, Bartłomiej Nankiewicz<bartlomiej.nankiewicz@gmail.com>
 *
 * This file is part of Organic.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// ** Tasks

// *** TODO type
// *** TODO refactor to switch case

// * Imports

import R from 'ramda';

export const DATA_STACKS = [
  'notes',
  'search',
  'searchResults',
  'agenda',
  'agendaResults',
  'markedPlaces',
  'lastCaptured',
];

// * Helpers

const getCurrentNavigationStack = (state) => state.navigationStackHistory[0];

export const doOnEachStack = (state, handler) => {
  let loadedNodesIds = state.loadedNodesIds;

  DATA_STACKS.forEach((stack) => {
    const ids = loadedNodesIds[stack];
    const visitedFileId = state.visitedFileId[stack];
    const visitedNodeId = state.visitedNodeId[stack];
    const newIds = handler(ids, visitedFileId, visitedNodeId);

    if (newIds !== ids) {
      loadedNodesIds = loadedNodesIds.merge({ [stack]: newIds });
    }
  });

  return loadedNodesIds !== state.loadedNodesIds
    ? state.merge({
        loadedNodesIds,
      })
    : state;
};

// * Reducers
// ** navigationStackChanged
export const navigationStackChanged = (state, { to }) => {
  if (state.navigationStackHistory[0] === to) {
    return state;
  }

  return state.merge({
    navigationStackHistory: R.pipe(
      R.prepend(to),
      R.when(R.pipe(R.length, R.gt(R.__, 2)), R.dropLast(1)),
    )(state.navigationStackHistory),
  });
};

// ** visitPlace
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
    visitedFileId: state.visitedFileId.setIn([navigationStack], fileId),
  });
};

// ** reset
export const reset = (state) => state.merge(INITIAL_STATE);

// ** resetStack
export const resetStack = (state, { navigationStack }) => {
  /* ------------- Reset Ids ------------- */

  console.tron.warn('resset stack' + navigationStack);
  const newState = R.pipe(
    R.cond([
      [
        () => navigationStack === 'searchResults',
        (ns) =>
          ns
            .setIn(['loadedNodesIds', 'searchResults'], [])
            .setIn(['isDataLoaded', 'searchResults'], false)
            .setIn(['loadedNodesIds', 'search'], [])
            .setIn(['isDataLoaded', 'search'], false),
      ],
      [
        () => navigationStack === 'notes',
        (ns) =>
          ns
            .setIn(['loadedNodesIds', 'notes'], [])
            .setIn(['isDataLoaded', 'notes'], false),
      ],
      [
        () => navigationStack === 'agenda',
        (ns) =>
          ns
            .setIn(['loadedNodesIds', 'agenda'], [])
            .setIn(['isDataLoaded', 'agenda'], false)
            .setIn(['loadedNodesIds', 'agendaResults'], [])
            .setIn(['isDataLoaded', 'agendaResults'], false),
      ],
      [R.T, R.identity],
    ]),

    /* ------------- Delete nodes ------------- */

    R.converge(
      (ns, nodesIds) =>
        ns.set('nodes', ns.nodes.without(nodesIds)).set('mode', 'browser'),
      [
        R.identity,
        (ns) => {
          const ids = R.chain((stack) => state.loadedNodesIds[stack])(
            DATA_STACKS,
          );
          const newIds = R.chain((stack) => ns.loadedNodesIds[stack])(
            DATA_STACKS,
          );
          const tocIds = R.chain((fileId) => ns.tocIds[fileId])(
            R.keys(state.tocIds),
          );
          return R.difference(ids, R.concat(newIds, tocIds));
        },
      ],
    ),
  )(state);

  return newState;
};

// ** setMode
export const setMode = (state, { mode }) => {
  return state.merge({ mode });
};

// ** stackLoaded
export const stackLoaded = (state, { name }) => {
  const cs = name || getCurrentNavigationStack(state);
  return state.merge({
    isDataLoaded: state.isDataLoaded.setIn([cs], true),
  });
};

// ** toggleMark
export const toggleMark = (state, { node }) => {
  const nodesIds = state.loadedNodesIds.markedPlaces;
  const val = R.ifElse(
    R.contains(node.id),
    R.without([node.id]),
    R.prepend(node.id),
  )(nodesIds);

  return state.setIn(['loadedNodesIds', 'markedPlaces'], val);
};

// ** openFileRequest
export const openFileRequest = (state) =>
  state.merge({
    [getCurrentNavigationStack(state)]: {
      isDataLoaded: false,
    },
  });

export const openIds = (state, { ids, navigationStack }) => {
  const stack = navigationStack || getCurrentNavigationStack(state);
  return state.merge({
    loadedNodesIds: state.loadedNodesIds.setIn([stack], ids),
  });
};

// * Export

export default {
  navigationStackChanged,
  openFileRequest,
  openIds,
  reset,
  resetStack,
  setMode,
  stackLoaded,
  toggleMark,
  visitPlace,
};
