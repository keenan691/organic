// * StartupRedux.ts

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

import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import {
  createStandardAction as action,
  getType,
  ActionType,
} from 'typesafe-actions';
import { globalizeSelectors } from './Helpers';
import { StartupInitialState as InitialState } from './types';

// ** Action Creators

const Creators = {
  agreePrivacyPolicy: action('AGREE_PRIVACY_POLICY')<void>(),
  startupFinished: action('STARTUP_FINISHED')<void>(),
  startup: action('STARTUP')<void>(),
};

export type StartupAction = ActionType<typeof Creators>;

// ** Initial State

export const INITIAL_STATE: InitialState = Immutable({
  firstRun: true,
  privacyPolicyAgreed: false,
});

// ** Selectors

const StartupSelectors = globalizeSelectors('startup')({
  isFirstRun: (state: InitialState) => state.firstRun,
  isPrivacyPolicyAgreed: (state: InitialState) => state.privacyPolicyAgreed,
});

// ** Reducers

const agreePrivacyPolicy = (state: InitialState) =>
  state.merge({
    privacyPolicyAgreed: true,
  });

const startupFinished = (state: InitialState) =>
  state.merge({
    firstRun: false,
  });

// ** Hookup Reducers To Types

const reducer = createReducer(INITIAL_STATE, {
  [getType(Creators.agreePrivacyPolicy)]: agreePrivacyPolicy,
  [getType(Creators.startupFinished)]: startupFinished,
});

// * Exports

export { reducer, StartupSelectors };
export default Creators;
