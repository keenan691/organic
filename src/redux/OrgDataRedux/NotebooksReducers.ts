// * NotebooksReducers.ts

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
import { doOnEachStack } from './NavigationReducers';
import { getCurrentNavigationStack } from './Selectors';

export const openFileRequest = (state) =>
  state.merge({
    [getCurrentNavigationStack(state)]: {
      isDataLoaded: false,
    },
  });

export const addOrgFileRequest = (state, { filepath }) => {
  return state.merge({});
};

// TODO fix should clear state
export const deleteFile = (state, { id }) => {
  return {};
};

export const fileAdded = (state) => state.merge(withSuccess({}));

export const loadToc = (state, { fileId, navigator }) => {
  const cs = getCurrentNavigationStack(state);
  return state.setIn(['loadedNodesIds', cs], state.tocIds[fileId]);
};

export const updateFile = (state, { item }) =>
  state.setIn(['files', item.id], R.merge(state.files[item.id], item));

export const updateFileIds = (state, { fileId, nodesIds, tocIds }) => {
  return R.pipe(
    R.when(() => tocIds !== null, (ns) => ns.setIn(['tocIds', fileId], tocIds)),
    R.when(
      () => nodesIds !== null,
      (ns) =>
        doOnEachStack(ns, (ids, visitedFileId) => {
          return visitedFileId === fileId ? nodesIds : ids;
        }),
    ),
  )(state);
};

export default {
  addOrgFileRequest,
  deleteFile,
  fileAdded,
  loadToc,
  openFileRequest,
  updateFile,
  updateFileIds,
};
