import { call, put, select, takeLatest } from 'redux-saga/effects'
import OrgApi from 'config/org-mode-connection'
import { PlainOrgFile } from 'org-mode-connection';
import actions from './actions';
import { getType } from 'typesafe-actions';
import { getDataSource } from 'helpers/files';

// TODO: don't clear whole db but only delete readme file
// TODO: handle error and cancel
function* loadFileContent(action: ReturnType<typeof actions.createFileFromSource.request>): Generator {
  const { path, sourceType } = action.payload
  const getRawContent = getDataSource(sourceType)
  const rawContent = yield call(getRawContent, path)
  yield call(OrgApi.clearDb)
  const createdFile: PlainOrgFile = yield call(OrgApi.createFileFromString, rawContent, "manual")
  yield put(actions.createFileFromSource.success(createdFile))
}

export default [
  takeLatest(getType(actions.createFileFromSource.request), loadFileContent),
]
