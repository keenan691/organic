// * SyncSagas.ts

// ** License

/**
 * Copyright (C) 2018, Bartłomiej Nankiewicz<bartlomiej.nankiewicz@gmail.com>
 *
 * This file is part of Organic.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// ** Tasks

// *** TODO Add types

// * Imports

import { OrgApi } from 'org-mode-connection';
import R from 'ramda';
import { ToastAndroid } from 'react-native';
import DialogAndroid from 'react-native-dialogs';
import { call, put, select } from 'redux-saga/effects';
import OrgDataRedux, { OrgDataSelectors } from '../redux/OrgDataRedux';
import SyncRedux, { SyncSelectors } from '../redux/SyncRedux';
import { getFileTitle } from '../utils/files';
import LoadSagas from './LoadSagas';

// * Code

export function* afterSync() {
  yield* LoadSagas.loadOrgData(false);
  yield put(SyncRedux.updateExternallyChangedFiles.request());
}

function* getExternallyChangedFiles() {
  const mTimes = yield call(OrgApi.getExternallyChangedFiles);
  yield put(
    SyncRedux.updateExternallyChangedFiles.success({
      payload: R.indexBy(R.prop('id'), mTimes),
    }),
  );
}

export function* markFilesAsChanged(nodesIds: string[]) {
  const nodesData = yield select(OrgDataSelectors.getNodes);
  const changedFilesIds = R.pipe(R.map((id) => nodesData[id].fileId), R.uniq)(
    nodesIds,
  );

  yield put(SyncRedux.markAsChanged({ filesIds: changedFilesIds }));
}

export function* syncFile({ id }) {
  const file = yield select(OrgDataSelectors.getFile(id));
  const fileName = getFileTitle(file);
  DialogAndroid.showProgress(`Synchronizing ${fileName} ...`, {
    style: DialogAndroid.progressHorizontal, // omit this to get circular
  });
  const results = yield call(OrgApi.syncFile, id);
  yield call(DialogAndroid.dismiss);
  yield put(SyncRedux.syncFileSuccess({ id }));
  yield call(
    ToastAndroid.show,
    `File ${file.path} synced successfully`,
    ToastAndroid.LONG,
  );
}

function* syncAllFiles() {
  const filesData = yield select(OrgDataSelectors.getFiles);
  const a = yield select(SyncSelectors.getExternallyChangedFiles);
  const b = yield select(SyncSelectors.getChangedFiles);
  const ids = R.pipe(
    R.symmetricDifference,
    R.filter((id) => filesData[id].path !== null),
  )(R.keys(a), R.keys(b));

  for (var i = 0; i < ids.length; i++) {
    const id = ids[i];
    yield* syncFile({ id });
  }

  if (ids.length > 0) {
    yield* afterSync();
  }
}

function* clearDb() {
  yield call(OrgApi.clearDb);
  yield put(OrgDataRedux.reset());
  yield put(OrgDataRedux.clearDbSuccess());
}

// * Export

export default {
  getExternallyChangedFiles,
  afterSync,
  markFilesAsChanged,
  syncFile,
  clearDb,
  syncAllFiles,
};
