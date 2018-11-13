// * AgendaRedux.ts

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

import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';
import {
  ActionType,
  createStandardAction as action,
  getType,
} from 'typesafe-actions';
import { globalizeSelectors } from './Helpers';
import { AgendaInitialState as IS } from './types';

// ** Action Creators

const Creators = {
  agendaSelectDay: action('AGENDA_SELECT_DAY')<{ day: string }>(),
};

export type AgendaAction = ActionType<typeof Creators>;

// ** Initial State

export const INITIAL_STATE: IS = Immutable({
  selectedDay: null,
});

// ** Selectors

const getSelectedDay = createSelector(
  [(state: IS) => state.selectedDay],
  (selectedDay) =>
    selectedDay === null
      ? new Date().toISOString().substring(0, 10)
      : selectedDay,
);

// TODO remove or write
const countTodaysTasks = (state: IS) => 3;

const AgendaSelectors = globalizeSelectors('agenda')({
  getSelectedDay,
  countTodaysTasks,
});

// ** Reducer

const reducer = (state = INITIAL_STATE, action: AgendaAction) => {
  switch (action.type) {
    case getType(Creators.agendaSelectDay): {
      const { day } = action.payload;
      return state.merge({ selectedDay: day });
    }
    default:
      return state;
  }
};

// * Exports

export { reducer, AgendaSelectors };
export default Creators;
