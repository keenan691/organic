import { call, put, select } from 'redux-saga/effects'
import { actions } from '../store'
import OrgApi from 'config/org-mode-connection'
import { getDataSource } from '../helpers';
import { PlainOrgFile } from 'org-mode-connection';

// TODO: don't clear whole db but only delete readme file
// TODO: handle error and cancel
export default function*(action: ReturnType<typeof actions.createFileFromSource.request>): Generator {
  const { path, sourceType } = action.payload
  const getRawContent = getDataSource(sourceType)
  const rawContent = yield call(getRawContent, path)
  yield call(OrgApi.clearDb)
  const createdFile: PlainOrgFile = yield call(OrgApi.createFileFromString, rawContent, "manual")
  yield put(actions.createFileFromSource.success(createdFile))
}
