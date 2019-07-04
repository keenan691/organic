import { call, put, select } from 'redux-saga/effects'

import { startupActions, startupSelectors } from 'core/startup'
import { entriesActions } from 'core/entries';
import { filesActions } from 'core/files';
import { appConfig } from 'config/app';

export default function*(action: ReturnType<typeof startupActions.startup.request>): Generator {
  const isFirstRun = yield select(startupSelectors.getIsFirstRun)

  if (isFirstRun) {
    // Loads Organic manual
    // NOTE Android specific
    yield put(
      filesActions.createFileFromSource.request({
        path: appConfig.readmeFilePath,
        sourceType: 'assets',
      })
    )
  }
  yield put(entriesActions.preloadEntries.request())
  yield put(startupActions.startup.success())
}
