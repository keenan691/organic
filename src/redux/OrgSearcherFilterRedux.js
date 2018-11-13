import { createReducer, createActions } from "reduxsauce";
import Immutable from "seamless-immutable";
import R from "ramda";

import { createSelector } from "reselect";
import { OrgDataSelectors } from "./OrgDataRedux";
import { SettingsSelectors } from "./SettingsRedux";

// * Types and Action Creators

// deleteQuery
// renameQuery
const { Types, Creators } = createActions({
  renameQuery: ["oldName", "newName"],
  deleteQuery: ["name"],
  saveSearchQuerySuccess: ["name"],
  saveSearchQueryRequest: null,
  loadSearchQuery: ["query"],
  updateSearchQuery: ["path", "value"],
  resetSearchFilter: null
});

export const SearchFilterTypes = Types;
export default Creators;

// * Initial State
const EMPTY_QUERY = {
  name: null,
  todos: {},
  tags: {},
  priority: {
    A: 0,
    B: 0,
    C: 0
  },
  isScheduled: false,
  hasDeadline: false,
  searchTerm: ""
};

export const INITIAL_STATE = Immutable({
  query: EMPTY_QUERY,
  savedItems: [
    // {
    //   name: "tasks with A priority",
    //   todos: {
    //     TODO: 1,
    //     NEXT: 1
    //   },
    //   tags: {},
    //   priority: {
    //     A: 1,
    //     B: 0,
    //     C: 0
    //   },
    //   isScheduled: false,
    //   hasDeadline: false,
    //   searchTerm: ""
    // }
  ],
  visibilityFilter: {
    narrowToFile: undefined,
    sorting: undefined
  }
});

// * Selectors

const createEmptyFilter = R.pipe(R.map(R.flip(R.pair)(0)), R.fromPairs);

const emptyTodoFilter = createSelector(
  [SettingsSelectors.taskStates],
  taskStates => {
    return createEmptyFilter(taskStates);
  }
);

const emptyTagsFilter = createSelector(
  [SettingsSelectors.userTags, OrgDataSelectors.getTags],
  (userTags, orgDataTags) => {
    return createEmptyFilter(R.concat(userTags, orgDataTags));
  }
);

const currentSearchQuery = state => state.searchFilter.query;

const getQuery = createSelector(
  [emptyTagsFilter, emptyTodoFilter, currentSearchQuery],
  (emptyTags, emptyTodos, currentQuery) => {
    return currentQuery.merge({
      todos: R.merge(emptyTodos, currentQuery.todos),
      tags: R.merge(emptyTags, currentQuery.tags)
    });
  }
);

const isQueryEmpty = createSelector(
  [state => state.searchFilter.query],
  query => R.equals(query, INITIAL_STATE.query)
);

export const SearchFilterSelectors = {
  getQuery,
  isQueryEmpty,
  getQueryName: state => state.searchFilter.query.name,
  savedItems: state => state.searchFilter.savedItems,
  itemExists: name => state =>
    R.find(R.propEq("name", name), state.searchFilter.savedItems)
};

// * Reducers

export const renameQuery = (state, { oldName, newName }) => {
  const itemIndex = R.findIndex(R.propEq("name", oldName), state.savedItems);
  const savedItems = R.clone(state.savedItems);
  savedItems[itemIndex].name = newName;
  return state.merge({
    savedItems
  });
};

export const deleteQuery = (state, { name }) =>
  Immutable(
    R.evolve(
      {
        savedItems: R.reject(R.propEq("name", name))
      },
      state
    )
  );

export const saveSearchQuerySuccess = (state, { name }) => {
  return state
    .merge({
      savedItems: R.append({ ...state.query, name }, state.savedItems)
    })
    .setIn(["query", "name"], name);
};

export const loadSearchQuery = (state, { query }) => {
  return state.merge({ query });
};

const updateSearchQuery = (state, { path, value }) => {
  let ns;
  if (value === 0) {
    const st = R.dissocPath(R.concat(["query"], path), state);
    ns = Immutable(st);
  } else {
    ns = state.setIn(R.concat(["query"], path), value);
  }
  return ns.setIn(["query", "name"], null);
};

const resetSearchFilter = state => state.merge({ query: EMPTY_QUERY });

// * Hookup Reducers To Types

export const reducer = createReducer(INITIAL_STATE, {
  [Types.RENAME_QUERY]: renameQuery,
  [Types.DELETE_QUERY]: deleteQuery,
  [Types.SAVE_SEARCH_QUERY_SUCCESS]: saveSearchQuerySuccess,
  [Types.LOAD_SEARCH_QUERY]: loadSearchQuery,
  [Types.UPDATE_SEARCH_QUERY]: updateSearchQuery,
  [Types.RESET_SEARCH_FILTER]: resetSearchFilter
});
