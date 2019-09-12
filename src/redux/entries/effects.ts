import {PlainOrgNode} from 'org-mode-connection'
import {call, put, takeLatest} from 'redux-saga/effects'
import {getType} from 'typesafe-actions'

import OrgApi from 'config/org-mode-connection'

import actions from './actions'

function* loadEntriesForEntryPoint(
  action: ReturnType<typeof actions.loadEntriesForEntryPoint.request>,
): Generator {
  const {
    payload: {id, type},
  } = action
  if (type === 'file') {
    const apiResponse = yield call(OrgApi.getFileAsPlainObject, id)
    const entries: PlainOrgNode[] = apiResponse.nodesList //.splice(0, 20)

    yield put(actions.mergeEditorEntries(entries))
  }
}

// prettier-ignore
export default [
  takeLatest(getType(actions.loadEntriesForEntryPoint.request), loadEntriesForEntryPoint),
]
