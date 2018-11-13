// * Imports

import { createReducer, createActions } from "reduxsauce";
import { createSelector } from "reselect";
import Immutable from "seamless-immutable";
import R from "ramda";
import moment from "moment";

import { range } from "../funcs";

// * Types And Action Creators

// loadItems
const { Types, Creators } = createActions({
  agendaLoadItems: ["month"],
  agendaSelectDay: ["day"],
  agendaRequest: ["items"],
  agendaSuccess: ["payload"],
  agendaFailure: null
});

export const AgendaTypes = Types;
export default Creators;

// * Initial State

export const INITIAL_STATE = Immutable({
  selectedDay: null,
  loadedMonth: null,
  items: null,
  fetching: null,
  payload: null,
  error: null
});

// * Selectors

const getSelectedDay = createSelector(
  [state => state.agenda.selectedDay],
  selectedDay =>
    selectedDay === null
      ? new Date().toISOString().substring(0, 10)
      : selectedDay
);

const countTodaysTasks = createSelector(
  [state => state.data.timestamp],
  timestamps => {
    return 3
  }
);

export const AgendaSelectors = {
  getItems: state => state.agenda.items,
  getSelectedDay,
 countTodaysTasks
};
// * Funcs
const generateEmptyDays = (year, month) => {
  const daysInMonth = moment({ year, month: month - 1 }).daysInMonth();
  const items = R.pipe(
    R.range(1),
    R.into(
      {},
      R.map(day => [
        moment({ year, month: month - 1, day }).format("YYYY-MM-DD"),
        []
      ])
    )
  )(daysInMonth + 1);
  return items
};
// * Reducers

export const loadItems = (
  state,
  { month: { year, month, day, dateString } }
) => {

  return state
  if (R.equals(state.loadedMonth, {year, month})) return state

  const items = generateEmptyDays(month);
  return state
    .merge({ items: { ...state.items, ...items } })
    .set("loadedMonth", { year, month })
    .set("selectedDay", dateString);
};

export const selectDay = (state, { day }) => {
  return state.merge({ selectedDay: day });
};

// request the items from an api
export const request = (state, { items }) =>
  state.merge({ fetching: true, items, payload: null });

// successful api lookup
export const success = (state, action) => {
  const { payload } = action;
  return state.merge({ items: {
    ...generateEmptyDays(2018, 8),
    ...payload
  }});
};

// Something went wrong somewhere.
export const failure = state =>
  state.merge({ fetching: false, error: true, payload: null });

// * Hookup Reducers To Types-

export const reducer = createReducer(INITIAL_STATE, {
  [Types.AGENDA_LOAD_ITEMS]: loadItems,
  [Types.AGENDA_SELECT_DAY]: selectDay,
  [Types.AGENDA_REQUEST]: request,
  [Types.AGENDA_SUCCESS]: success,
  [Types.AGENDA_FAILURE]: failure
});
