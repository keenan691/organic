// * SettingsRedux.ts

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
import { createReducer } from 'reduxsauce';
import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';
import { createStandardAction as action, ActionType } from 'typesafe-actions';
import { globalizeSelectors } from './Helpers';
import { SettingsInitialState as InitialState } from './types';

// ** Action Creators

const Creators = {
  removeTodoState: action('REMOVE_TODO_STATE')<void>(),
  addTodoState: action('ADD_TODO_STATE')<void>(),
};

export type SettingsAction = ActionType<typeof Creators>;

// ** Initial State

export const INITIAL_STATE: InitialState = Immutable({
  unfinishedTaskStates: [
    'TODO',
    'NEXT',
    'PROJECT',
    'BRAINSTORM',
    'WAITING',
    'IDEA',
    'FIXME',
    'REVIEW',
    'SOMEDAY',
    'MAYBE',
  ],
  finishedTaskStates: ['DONE'],
  priorities: ['A', 'B', 'C'],
  pinnedTag: 'PIN',
  theme: 'bright',
  tags: [],
});

// ** Selectors

const unfinishedTaskStates = (state: InitialState) =>
  state.unfinishedTaskStates;

const finishedTaskStates = (state: InitialState) => state.finishedTaskStates;

const taskStates = createSelector(
  [unfinishedTaskStates, finishedTaskStates],
  (todo, done) => R.concat(todo, done),
);

const SettingsSelectors = globalizeSelectors('settings')({
  userTags: (state: InitialState) => state.tags,
  taskStates,
});

// ** Reducers

// TODO export const addTodoState = (state, action) => state.merge({});
// TODO export const removeTodoState = (state, action) => state.merge({});

// ** Hookup Reducers To Types

const reducer = createReducer(INITIAL_STATE, {
  // [Types.REMOVE_TODO_STATE]: removeTodoState,
  // [Types.ADD_TODO_STATE]: addTodoState
});

// * Exports

export { reducer, SettingsSelectors };
export default Creators;
