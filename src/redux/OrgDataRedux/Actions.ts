// * Actions.ts - Typesafe actions

import { PlainOrgFile, PlainOrgNode, TimeRange } from 'org-mode-connection';
import { createStandardAction as action } from 'typesafe-actions';
import { DataStack } from './types';

export const addNotebook = action('ADD_NOTEBOOK')<{ name: string }>();
export const addNotebookRequest = action('ADD_NOTEBOOK_REQUEST')<void>();
export const addOrgFileRequest = action('ADD_ORG_FILE_REQUEST')<{
  filepath: string;
}>();
export const addOrgFileSuccess = action('ADD_ORG_FILE_SUCCESS')<{
  filepath: string;
}>();
export const addToLastCaptured = action('ADD_TO_LAST_CAPTURED')<{
  node: PlainOrgNode;
}>();
export const clearDbRequest = action('CLEAR_DB_REQUEST')<void>();
export const clearDbSuccess = action('CLEAR_DB_SUCCESS')<void>();
export const clearLastAddedNode = action('CLEAR_LAST_ADDED_NODE')<void>();
export const deleteFile = action('DELETE_FILE')<{ id: string }>();
export const deleteNodes = action('DELETE_NODES')<{ ids: string[] }>();
export const getOrgDataRequest = action('GET_ORG_DATA_REQUEST')<void>();
export const getOrgDataSuccess = action('GET_ORG_DATA_SUCCESS')<{
  files: PlainOrgFile[];
  tags: string;
}>();
export const loadDayAgenda = action('LOAD_DAY_AGENDA')<{ date: string }>();
export const loadRelatedNodes = action('LOAD_RELATED_NODES')<{
  nodeId: string;
}>();
export const loadToc = action('LOAD_TOC')<{
  fileId: string;
  navigator: object;
}>();
export const loadWeekAgenda = action('LOAD_WEEK_AGENDA')<{ date: string }>();
export const mergeNodeChanges = action('MERGE_NODE_CHANGES')<{
  changes: object;
  nodesIds: string[];
}>();
export const move = action('MOVE')<{
  id: string;
  direction: 'down' | 'up' | 'left' | 'right';
  withDescendants: boolean;
}>();
export const navigationStackChanged = action('NAVIGATION_STACK_CHANGED')<{
  to: DataStack;
}>();
export const openFileRequest = action('OPEN_FILE_REQUEST')<{
  fileId: string;
  nodeId: string;
}>();
export const openIds = action('OPEN_IDS')<{
  ids: string[];
  navigationStack: DataStack;
}>();
export const removeNodes = action('REMOVE_NODES')<{ ids: string }>();
export const rescheduleAgenda = action('RESCHEDULE_AGENDA')<{
  changes: object;
  nodesIds: string[];
}>();
export const reset = action('RESET')<void>();
export const resetStack = action('RESET_STACK')<{ screenId: string }>();
export const runNodeActionRequest = action('RUN_NODE_ACTION_REQUEST')<{
  actionName: string;
  ids: string[];
  navigator: object;
  node: object;
  navigationStack: DataStack;
  doAfterAction: () => void;
  doBeforeAction: () => void;
}>();
export const runNodeAction = action('RUN_NODE_ACTION')<{
  actionName: string;
  ids: string[];
  navigator: object;
  node: PlainOrgNode;
  navigationStack: DataStack;
}>();
export const setMode = action('SET_MODE')<{ mode: string }>();
export const showFileActionsDialog = action('SHOW_FILE_ACTIONS_DIALOG')<{
  item: string;
}>();
export const stackLoaded = action('STACK_LOADED')<{ name: DataStack }>();
export const syncAllFilesRequest = action('SYNC_ALL_FILES_REQUEST')<void>();
export const syncAllFilesSuccess = action('SYNC_ALL_FILES_SUCCESS')<void>();
export const toggleMark = action('TOGGLE_MARK')<{ node: string }>();
export const updateFile = action('UPDATE_FILE')<{ item: string }>();
export const updateFileIds = action('UPDATE_FILE_IDS')<{
  fileId: string;
  nodesIds: string[];
  tocIds: string[];
}>();
export const updateLoadedNodes = action('UPDATE_LOADED_NODES')<{
  nodes: string[];
}>();
export const updateNode = action('UPDATE_NODE')<{
  node: PlainOrgNode;
  nodesIds: string[];
}>();
export const updateOrgData = action('UPDATE_ORG_DATA')<{
  fileData: PlainOrgFile;
  nodesList: PlainOrgNode[];
  nodeID: string;
}>();
export const updateTimestamps = action('UPDATE_TIMESTAMPS')<{
  agendaItems: object;
  dayAgendaItems: object;
  range: TimeRange;
}>();
export const visitPlace = action('VISIT_PLACE')<{
  fileId: string;
  nodeId: string;
  navigationStack: DataStack;
}>();
