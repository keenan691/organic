import { all, takeEvery, takeLatest, call, put } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'
import actions from './actions';
import OrgApi from 'config/org-mode-connection';
import { PlainOrgFile } from 'org-mode-connection';

function* loadFileContent(action: ReturnType<typeof actions.addSource.request>): Generator {
  const {content, source, stat} = action.payload
  // const getRawContent = getDataSource(sourceType)
  // const rawContent = yield call(getRawContent, path)
  yield call(OrgApi.clearDb)
  const createdFile: PlainOrgFile = yield call(OrgApi.createFileFromString, content, "webdav")
  const { id, metadata, description } = createdFile
  yield put(actions.addSource.success({
    id,
    metadata,
    description,
    ...source,
    ...stat
  }))
}

// prettier-ignore
export default [
  takeLatest(getType(actions.addSource.request), loadFileContent),
]
