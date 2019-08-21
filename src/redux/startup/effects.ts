import {put, select, takeLatest, call} from 'redux-saga/effects';

import {entriesActions} from 'redux/entries';
import {filesActions} from 'redux/files';
import {appConfig} from 'config/app';
import actions from './actions';
import selectors from './selectors';
import {getType} from 'typesafe-actions';
import {tabbedNavigation} from 'layouts';

function* startupRequest(
  action: ReturnType<typeof actions.startup.request>,
): Generator {
  const isFirstRun = yield select(selectors.getIsFirstRun);

  if (isFirstRun) {
    yield* loadManual();
  }

  yield put(entriesActions.preloadEntries.request());
  yield put(actions.startup.success());
}

function* loadManual() {
  yield put(
    filesActions.createFileFromSource.request({
      path: appConfig.readmeFilePath,
      sourceType: 'assets',
    }),
  );
}

function* startupSuccess(
  action: ReturnType<typeof actions.startup.success>,
): Generator {
  yield call(tabbedNavigation)

}

export default [
  takeLatest(getType(actions.startup.request), startupRequest),
  takeLatest(getType(actions.startup.success), startupSuccess),
];
