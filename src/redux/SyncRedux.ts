// * SyncRedux.ts

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

// ** Imports

import R from 'ramda';
import Immutable from 'seamless-immutable';
import {
  ActionType,
  createAsyncAction as asyncAction,
  createStandardAction as action,
  getType,
} from 'typesafe-actions';
import { globalizeSelectors } from './Helpers';
import { SyncInitialState as IS } from './types';

// ** Action Creators

const Creators = {
  markAsChanged: action('MARK_AS_CHANGED')<{ filesIds: string[] }>(),
  syncFileSuccess: action('SYNC_FILE_SUCCESS')<{ id: string }>(),
  updateExternallyChangedFiles: asyncAction(
    'UPDATE_EXTERNALLY_CHANGED_FILES_REQUEST',
    'UPDATE_EXTERNALLY_CHANGED_FILES_SUCCESS',
    'UPDATE_EXTERNALLY_CHANGED_FILES_FAILURE',
  )<void, { payload: object }, Error>(),
};

export type SyncAction = ActionType<typeof Creators>;

// ** Initial State

export const INITIAL_STATE: IS = Immutable({
  externallyChangedFiles: {},
  changedFiles: {},
});

// ** Selectors

const SyncSelectors = globalizeSelectors('sync')({
  getExternallyChangedFiles: (state: IS) => state.externallyChangedFiles,
  getChangedFiles: (state: IS) => state.changedFiles,
});

// ** Reducer

const reducer = (state = INITIAL_STATE, action: SyncAction) => {
  switch (action.type) {
    case getType(Creators.syncFileSuccess):
      const { id } = action.payload;
      return state.merge({
        externallyChangedFiles: state.externallyChangedFiles.without(id),
        changedFiles: state.changedFiles.without(id),
      });

    case getType(Creators.updateExternallyChangedFiles.success):
      const { payload } = action.payload;
      if (R.equals(state.externallyChangedFiles, payload)) return state;
      return state.merge({
        externallyChangedFiles: payload,
      });

    case getType(Creators.markAsChanged):
      const { filesIds } = action.payload;
      const changedIds = R.keys(state.changedFiles);
      const notCheckedFilesIds = filesIds.filter(
        (id) => !changedIds.includes(id),
      );
      if (notCheckedFilesIds.length === 0) {
        return state;
      }
      const changes = notCheckedFilesIds.reduce(
        (acc, id) => (acc[id] = { [id]: { isChanged: true } }),
        {},
      );
      return state.setIn(['changedFiles'], {
        ...state.changedFiles,
        ...changes,
      });

    default:
      return state;
  }
};

// * Exports

export { reducer, SyncSelectors };
export default Creators;
