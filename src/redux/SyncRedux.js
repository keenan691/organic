// * Imports

import { createReducer, createActions } from "reduxsauce";
import Immutable from "seamless-immutable";
import R from "ramda";

// * Types And Action Creators
// updateExternallyChangedFilesRequest
// updateExternallyChangedFilesSuccess
// syncFileSuccess
// markAsChanged
const { Types, Creators } = createActions({
  markAsChanged: ["filesIds"],
  syncFileSuccess: ["id"],
  updateExternallyChangedFilesSuccess: ["payload"],
  updateExternallyChangedFilesRequest: ["data"]
});

export const SyncTypes = Types;
export default Creators;

// * Initial State

export const INITIAL_STATE = Immutable({
  externallyChangedFiles: {},
  changedFiles: {}
});

// * Selectors

export const SyncSelectors = {
  getExternallyChangedFiles: state => state.sync.externallyChangedFiles,
  getChangedFiles: state => state.sync.changedFiles
};

// * Reducers

export const syncFileSuccess = (state, { id }) => {
  return state.merge({
    externallyChangedFiles: state.externallyChangedFiles.without(id),
    changedFiles: state.changedFiles.without(id)
  });
};

export const updateExternallyChangedFilesSuccess = (state, { payload }) => {
  if (R.equals(state.externallyChangedFiles, payload)) return state;

  return state.merge({
    externallyChangedFiles: payload
  });
};

export const markAsChanged = (state, { filesIds }) => {
  const changedIds = R.keys(state.changedFiles);
  const notCheckedFilesIds = filesIds.filter(id => !changedIds.includes(id));
  if (notCheckedFilesIds.length === 0) return state;

  const changes = notCheckedFilesIds.reduce(
    (acc, id) => (acc[id] = { [id]: { isChanged: true } }),
    {}
  );

  return state.setIn(["changedFiles"], {
    ...state.changedFiles,
    ...changes
  });
};

// export const updateExternallyChangedFilesRequest = (state, { data }) => { return state.merge({}) }

// * Hookup Reducers To Types-

export const reducer = createReducer(INITIAL_STATE, {
  [Types.MARK_AS_CHANGED]: markAsChanged,
  [Types.SYNC_FILE_SUCCESS]: syncFileSuccess,
  [Types.UPDATE_EXTERNALLY_CHANGED_FILES_SUCCESS]: updateExternallyChangedFilesSuccess
  // [Types.UPDATE_EXTERNALLY_CHANGED_FILES_REQUEST]: updateExternallyChangedFilesRequest,
});
