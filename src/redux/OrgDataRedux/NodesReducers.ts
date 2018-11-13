// * NodesReducers.ts

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

// ** Code

import R from 'ramda';
import Selectors from './Selectors';
import { InitialState } from './types';


export const addToLastCaptured = (state: InitialState, { node }) => {
  return state.setIn(
    ['loadedNodesIds', 'lastCaptured'],
    R.pipe(
      R.prepend(node.id),
      R.when((list) => list.length > 20, R.dropLast(1)),
    )(state.loadedNodesIds.lastCaptured),
  );
};

export const clearLastAddedNode = (state: InitialState) => {
  return state.merge({
    lastAddedNode: null,
  });
};

export const deleteNodes = (state: InitialState, { ids }) => {
  return state.merge({
    nodes: R.omit(ids, state.nodes),
    timestamps: R.reject((ts) => ids.includes(ts.nodeId))(state.timestamps),
    dayTimestamps: R.reject((ts) => ids.includes(ts.nodeId))(
      state.dayTimestamps,
    ),
  });
};

export const openIds = (state: InitialState, { ids, navigationStack }) => {
  const stack = navigationStack || Selectors.getCurrentNavigationStack(state);
  return state.merge({
    loadedNodesIds: state.loadedNodesIds.setIn([stack], ids),
  });
};

const mergeNodeChanges = (state: InitialState, { changes, nodesIds }) => {
  if (!nodesIds) nodesIds = [changes.id];

  const updatedNodes = R.into(
    {},
    R.addIndex(R.map)((id, idx) => ({
      [id]: {
        ...state.nodes[id],
        ...(Array.isArray(changes) ? changes[idx] : changes),
      },
    })),
    nodesIds,
  );
  return state.merge({
    nodes: state.nodes.merge(updatedNodes),
  });
};

export const removeNodes = (state: InitialState, { ids }) => {
  return state.merge({
    loadedNodesIds: R.map(R.without(ids), state.loadedNodesIds),
    tocIds: R.map(R.without(ids), state.tocIds),
  });
};

export const updateLoadedNodes = (state: InitialState, { nodes }) => {
  return state.merge({
    nodes: state.nodes.merge(nodes),
  });
};

export const loadRelatedNodes = (state: InitialState, action) =>
  state.merge({});

// * Export

export default {
  removeNodes,
  mergeNodeChanges,
  deleteNodes,
  clearLastAddedNode,
  addToLastCaptured,
  updateLoadedNodes,
  loadRelatedNodes,
  openIds,
};
