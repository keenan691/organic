// * NotebookSagas.ts

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
import DialogAndroid from 'react-native-dialogs';
import { call, put, select } from 'redux-saga/effects';
import CaptureActions from '../redux/CaptureRedux';
import OrgDataRedux, { OrgDataSelectors } from '../redux/OrgDataRedux';
import SyncRedux from '../redux/SyncRedux';
import { textInputDialog, alert } from './Helpers';
import LoadSagas from './LoadSagas';

// * Code

export function* addNotebook(action) {
  const res = yield* textInputDialog('Add notebook', 'Enter name of notebook');
  if (res) {
    const files = yield select(OrgDataSelectors.getFiles);
    const fileWithThisName = R.find(
      R.pathEq(['metadata', 'TITLE'], res),
      R.values(files),
    );

    if (fileWithThisName) {
      yield* alert('Error', `File with name "${res}" already exists.`);
    } else {
      const newFile = yield call(OrgApi.addFile, res);
      yield* LoadSagas.loadOrgData();
    }
  }
}

function* addOrgFile(action) {
  const { filepath } = action;
  const importedFiles = yield select(OrgDataSelectors.getFiles);
  const canImport = R.pipe(
    R.filter((file) => file.path === filepath),
    R.isEmpty,
  )(importedFiles);
  if (canImport) {
    DialogAndroid.showProgress(`Importing ${filepath} ...`, {
      style: DialogAndroid.progressHorizontal, // omit this to get circular
    });

    const res = yield call(OrgApi.importFile, filepath);
    yield put(OrgDataRedux.getOrgDataRequest());
    yield call(DialogAndroid.dismiss);
  } else {
    DialogAndroid.alert('File is already imported.');
  }
}

function* deleteFile(file) {
  DialogAndroid.showProgress(`Deleting ${file.id} ...`, {
    style: DialogAndroid.progressHorizontal, // omit this to get circular
  });

  yield put(CaptureActions.deleteCaptureTemplatesOfFile(file.id));
  yield put(SyncRedux.syncFileSuccess({ id: file.id })); // Removes files statuses
  yield put(OrgDataRedux.deleteFile(file.id));
  yield call(OrgApi.deleteFileById, file.id);
  yield put(OrgDataRedux.getOrgDataRequest());

  DialogAndroid.dismiss();
}

// * Export

export default {
  addOrgFile,
  addNotebook,
  deleteFile,
};
