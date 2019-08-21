import { all, takeEvery, takeLatest } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'
import { call, put, select } from 'redux-saga/effects'
import OrgApi from 'config/org-mode-connection';
import { Tocs } from 'org-mode-connection';
import actions from './actions';

function* loadEntries(action: ReturnType<typeof actions.loadEntries.request>): Generator {
  console.tron.error('Effect loadEntries not implemented')
}

function* preloadEntries(action: ReturnType<typeof actions.preloadEntries.request>): Generator {
  const tocs: Tocs = yield call(OrgApi.getTocs);
  yield put(actions.preloadEntries.success({
    objects: tocs.data,
    orderingByFile: tocs.ids
  }))
}

// prettier-ignore
export default [
  takeLatest(getType(actions.loadEntries.request), loadEntries),
  takeLatest(getType(actions.preloadEntries.request), preloadEntries),
]
