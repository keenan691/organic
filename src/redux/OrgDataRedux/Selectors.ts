// * Selectors.ts

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

// ** Code

import R from 'ramda';
import { createSelector } from 'reselect';
import { globalizeParametrizedSelectors, globalizeSelectors } from '../Helpers';
import { DataStack, InitialState, Node } from './types';

// *** Base selectors

const baseSelectors = {
  getDayTimestamps: R.path(['dayTimestamps']),
  getFiles: R.path(['files']),
  getLastCapturedIds: R.path<string[]>(['loadedNodesIds', 'lastCaptured']),
  getLoadedNodesIds: R.prop('loadedNodesIds'),
  getMode: R.path(['mode']),
  getNodes: R.pathOr({}, ['nodes']),
  getTags: R.path(['tags']),
  getTimestamps: R.path(['timestamps']),
  getTimestampsRange: R.path(['timestampsRange']),
  getVisitedNodeId: R.path(['visitedNodeId']),
  isDataLoaded: R.path(['isDataLoaded']),
};

export const getCurrentNavigationStack = (state: InitialState) =>
  state.navigationStackHistory[0];

const navigationStackHistory = (state: InitialState) =>
  state.navigationStackHistory;

const filterNodesDictBy = (fileId: string) =>
  R.filter((obj: Node) => obj.fileId === fileId);

const getFileNodes = (fileId: string) =>
  R.pipe(
    baseSelectors.getNodes,
    filterNodesDictBy(fileId),
    R.values,
    R.sortBy(R.prop('position')),
  );

const getNodes = (navStack: DataStack) =>
  createSelector(
    [
      (state: InitialState) => baseSelectors.getLoadedNodesIds(state)[navStack],
      baseSelectors.getNodes,
    ],
    (ids: string[], data) => ids.map((id) => data[id]),
  );

const getMarkedPlaces = getNodes('markedPlaces');

// *** Memoized selectors

const getFilesIds = createSelector([baseSelectors.getFiles], (files) =>
  R.keys(files),
);

const getLastCapturedNotes = createSelector(
  [baseSelectors.getLastCapturedIds, baseSelectors.getNodes],
  (ids, data) => ids.map((id) => data[id]),
);

// *** Selectors
// ** Exports

const selectors = {
  ...baseSelectors,
  getCurrentNavigationStack: (state: InitialState) =>
    state.navigationStackHistory[0],
  getFilesIds,
  getLastCapturedNotes,
  getMarkedPlaces,
  isVisitedPlaceSink: () => false, // TODO write this function
  navigationStackHistory,
};

const parametrizedSelectors = {
  getNode: (id: string) => R.path(['nodes', id]),
  getFile: (id: string) => R.path(['files', id]),
  getFileNodes,
};

// ** Export helpers

// FIXME it is not working with variable containing `data`
export default {
  ...globalizeSelectors('data')(selectors),
  ...globalizeParametrizedSelectors('data')(parametrizedSelectors),
};
