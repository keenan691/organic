import { call, put, select } from 'redux-saga/effects'
import { entriesActions, entriesSelectors } from 'core/entries'
import OrgApi from 'config/org-mode-connection';
import { Tocs } from 'org-mode-connection';

export default function*(action: ReturnType<typeof entriesActions.preloadEntries.request>): Generator {
  const tocs: Tocs = yield call(OrgApi.getTocs);
  yield put(entriesActions.preloadEntries.success({
    objects: tocs.data,
    orderingByFile: tocs.ids
  }))
}
