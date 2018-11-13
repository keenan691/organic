// * Helpers.ts<OrgDataRedux>

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

export const success = (state) => state.merge(withSuccess({}));

export const updateOrgData = (state, { fileData, nodesList }) => {
  const cs = Selectors.getCurrentNavigationStack(state);
  return state.merge({
    // loadedFileData: state.loadedFileData.setIn([cs], fileData),
    loadedNodesData: state.loadedNodesData.setIn(
      [cs],
      R.indexBy(R.prop('id'), nodesList),
      // R.into({}, R.map(R.identity), nodesList)
    ),
    loadedNodesIds: state.loadedNodesIds.setIn(
      [cs],
      nodesList.map((node) => node.id),
    ),
    visitedFileId: state.visitedFileId.setIn([cs], fileData.id),
    isDataLoaded: state.isDataLoaded.setIn([cs], true),
  });
};
export const withSuccess = R.merge({
  isBusy: false,
  errors: null,
});

// ** Outline functions

// *** getDescendantsIds
export const getDescendantsIds = ({
  loadedNodesData,
  loadedNodesIds,
  nodeId,
}) =>
  R.pipe(
    R.drop(loadedNodesData[nodeId].position + 1),
    R.takeWhile(
      (id) => loadedNodesData[id].level > loadedNodesData[nodeId].level,
    ),
  )(loadedNodesIds);

// *** findNextNodeSameLevel
export const findNextNodeSameLevel = ({ nodeId, nodes }) =>
  R.pipe(
    R.dropWhile(R.complement(R.equals(nodeId))),
    R.drop(1),
    R.find((id) => nodes[id].level === nodes[nodeId].level),
  );

// *** findPrevNodeSameLevel
export const findPrevNodeSameLevel = ({ nodeId, nodes }) =>
  R.pipe(R.reverse, findNextNodeSameLevel({ nodeId, nodes }));

// *** Refile
// **** clearDbSuccess
export const clearDbSuccess = (state) => state.merge([INITIAL_STATE]);

// **** getOrgDataSuccess
export const getOrgDataSuccess = (state, { files, tags }) =>
  state.merge(withSuccess({ files: R.indexBy(R.prop('id'), files), tags }));

// request the items from an api
export const request = (state, { items }) =>
  state.merge({ fetching: true, items, payload: null });
