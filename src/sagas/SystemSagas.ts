// * SystemSagas.ts

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

import { BackHandler } from 'react-native';
import RNFS from 'react-native-fs';
import { call, put, select } from 'redux-saga/effects';
import OrgDataRedux from '../redux/OrgDataRedux';
import StartupRedux, { StartupSelectors } from '../redux/StartupRedux';

// * Sagas

let backHandlerFix;

export function* manageBackHandlerFIX({ fileId, nodeId, navigationStack }) {
  // HACK Bug in react_native_navigation navigation screen visiblility event are not fired when using shared trransition
  if (navigationStack != 'notes') {
    return;
  }

  if (!fileId) {
    if (!nodeId) {
      yield put(OrgDataRedux.resetStack('NotesScreen'));
      try {
        backHandlerFix.remove();
      } catch (err) {
      } finally {
      }
      backHandlerFix = BackHandler.addEventListener('hardwareBackPress', () => {
        return true;
      });
    }
  } else {
    backHandlerFix.remove();
  }
}

export function* manageBackHandlerFIXremoveBackHandlers({ to }) {

  try {
    backHandlerFix.remove();
  } catch (err) {
  } finally {
  }
}

export function* startup(action) {
  if (__DEV__ && console.tron) {
    console.tron.log('Organic has started!');
  }

  /* ------------- Load readme if is first run ------------- */

  const firstRun = yield select(StartupSelectors.isFirstRun);
  if (firstRun) {
    const res = yield call(RNFS.readFileAssets, 'org/readme.org', 'utf8');
    // FIXME
    // yield call(OrgApi.createFileFromString, "readme.org", res.split("\n"));
  }
  yield put(OrgDataRedux.getOrgDataRequest());
  yield put(StartupRedux.startupFinished());
}

// * Export

export default {
  manageBackHandlerFIX,
  manageBackHandlerFIXremoveBackHandlers,
  startup,
};
