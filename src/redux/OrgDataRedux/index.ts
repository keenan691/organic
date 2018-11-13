// * index.ts<OrgDataRedux>

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

// *** DONE write typesafe actions - ./Actions.ts
// *** TODO connect typesafe actions
// *** TODO refactor to typesafe async actions

// ** Code

import moment from 'moment';
import R from 'ramda';
import { createActions, createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { getType } from 'typesafe-actions';
import * as DataActions from './Actions';
import AgendaReducers, { DAY_FORMAT } from './AgendaReducers';
import { clearDbSuccess, getOrgDataSuccess, request, success, updateOrgData, withSuccess } from './Helpers';
import NavigationReducers, { DATA_STACKS } from './NavigationReducers';
import NodesReducers from './NodesReducers';
import NotebooksReducers, { addOrgFileRequest } from './NotebooksReducers';
export { default as OrgDataSelectors } from './Selectors';

// *** Settings

export const SLICE_NAME = 'data';

// *** Constants

export const ModeTypes = Object.freeze({
  OUTLINE: 'outline',
  AGENDA: 'agenda',
  BROWSER: 'browser',
});

// *** Types And Action Creators

const { Types, Creators } = createActions({
  addNotebook: ['name'],
  addNotebookRequest: null,
  addOrgFileRequest: ['filepath'],
  addOrgFileSuccess: ['filepath'],
  addToLastCaptured: ['node'],
  clearDbRequest: null,
  clearDbSuccess: null,
  clearLastAddedNode: null,
  deleteFile: ['id'],
  deleteNodes: ['ids'],
  getOrgDataRequest: null,
  getOrgDataSuccess: ['files', 'tags', 'timestamps'],
  loadDayAgenda: ['date'],
  loadRelatedNodes: ['nodeId'],
  loadToc: ['fileId', 'navigator'],
  loadWeekAgenda: ['date'],
  mergeNodeChanges: ['changes', 'nodesIds'],
  move: ['id', 'direction', 'withDescendants'],
  navigationStackChanged: ['to'],
  openFileRequest: ['fileId', 'nodeId'],
  openIds: ['ids', 'navigationStack'],
  removeNodes: ['ids'],
  rescheduleAgenda: ['changes', 'nodesIds'],
  reset: null,
  resetStack: ['screenId'],
  runNodeActionRequest: [
    'actionName',
    'ids',
    'navigator',
    'node',
    'navigationStack',
    'doAfterAction',
    'doBeforeAction',
    'payload',
  ],
  runNodeAction: ['actionName', 'ids', 'navigator', 'node', 'navigationStack'],
  setMode: ['mode'],
  showFileActionsDialog: ['item'],
  stackLoaded: ['name'],
  syncAllFilesRequest: null,
  syncAllFilesSuccess: null,
  toggleMark: ['node'],
  updateFile: ['item'],
  updateFileIds: ['fileId', 'nodesIds', 'tocIds'],
  updateLoadedNodes: ['nodes'],
  updateNode: ['node', 'nodesIds'],
  updateOrgData: ['fileData', 'nodesList', 'nodeID'],
  updateTimestamps: ['agendaItems', 'dayAgendaItems', 'range'],
  visitPlace: ['fileId', 'nodeId', 'navigationStack'],
});

// *** Initial State

export const INITIAL_STATE = Immutable(
  withSuccess({
    agendaRange: {},
    files: {},
    isBusy: false,
    isDataLoaded: R.into({}, R.map((obj) => ({ [obj]: false })), DATA_STACKS),
    lastCapturedNodes: [],
    loadedNodesIds: R.into({}, R.map((obj) => ({ [obj]: [] })), DATA_STACKS),
    navigationStackHistory: [],
    nodes: {},
    tags: [],
    timestamps: [],
    timestampsRange: {
      start: moment().format(DAY_FORMAT),
      end: moment().format(DAY_FORMAT),
    },
    tocIds: {},
    visitedFileId: R.into({}, R.map((obj) => ({ [obj]: null })), DATA_STACKS),
    visitedNodeId: R.into({}, R.map((obj) => ({ [obj]: null })), DATA_STACKS),
  }),
);

// *** Hookup Reducers To Types

export const reducer = createReducer(INITIAL_STATE, {
  [getType(DataActions.addOrgFileRequest)]: addOrgFileRequest,
  [getType(DataActions.addOrgFileRequest)]: request,
  [getType(DataActions.addOrgFileSuccess)]: NotebooksReducers.fileAdded,
  [getType(DataActions.addToLastCaptured)]: NodesReducers.addToLastCaptured,
  [getType(DataActions.clearDbRequest)]: request,
  [getType(DataActions.clearDbSuccess)]: clearDbSuccess,
  [getType(DataActions.clearLastAddedNode)]: NodesReducers.clearLastAddedNode,
  [getType(DataActions.deleteFile)]: NotebooksReducers.deleteFile,
  [getType(DataActions.deleteNodes)]: NodesReducers.deleteNodes,
  [getType(DataActions.getOrgDataRequest)]: request,
  [getType(DataActions.getOrgDataSuccess)]: getOrgDataSuccess,
  [getType(DataActions.loadDayAgenda)]: AgendaReducers.loadDayAgenda,
  [getType(DataActions.loadRelatedNodes)]: NodesReducers.loadRelatedNodes,
  [getType(DataActions.loadToc)]: NotebooksReducers.loadToc,
  [getType(DataActions.loadWeekAgenda)]: AgendaReducers.loadWeekAgenda,
  [getType(DataActions.mergeNodeChanges)]: NodesReducers.mergeNodeChanges,
  [getType(
    DataActions.navigationStackChanged,
  )]: NavigationReducers.navigationStackChanged,
  [getType(DataActions.openIds)]: NavigationReducers.openIds,
  [getType(DataActions.removeNodes)]: NodesReducers.removeNodes,
  [getType(DataActions.rescheduleAgenda)]: AgendaReducers.rescheduleAgenda,
  [getType(DataActions.reset)]: NavigationReducers.reset,
  [getType(DataActions.setMode)]: NavigationReducers.setMode,
  [getType(DataActions.stackLoaded)]: NavigationReducers.stackLoaded,
  [getType(DataActions.syncAllFilesRequest)]: request,
  [getType(DataActions.syncAllFilesSuccess)]: success,
  [getType(DataActions.toggleMark)]: NavigationReducers.toggleMark,
  [getType(DataActions.updateFile)]: NotebooksReducers.updateFile,
  [getType(DataActions.updateFileIds)]: NotebooksReducers.updateFileIds,
  [getType(DataActions.updateLoadedNodes)]: NodesReducers.updateLoadedNodes,
  [getType(DataActions.updateOrgData)]: updateOrgData,
  [getType(DataActions.updateTimestamps)]: AgendaReducers.updateTimestamps,
  [getType(DataActions.visitPlace)]: NavigationReducers.visitPlace,
});

// ** Exports

export const OrgDataTypes = Types;
export default Creators;
