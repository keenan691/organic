// * OrgSearcherFilterRedux.ts

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
import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';
import {
  ActionType,
  createAsyncAction as asyncAction,
  createStandardAction as action,
  getType,
} from 'typesafe-actions';
import { globalizeParametrizedSelectors, globalizeSelectors } from './Helpers';
import { OrgDataSelectors } from './OrgDataRedux';
import { SettingsSelectors } from './SettingsRedux';
import { SearchFilterInitialState as IS, SearchQuery } from './types';

// ** Action Creators

const Creators = {
  deleteQuery: action('DELETE_QUERY')<{ name: string }>(),
  loadSearchQuery: action('LOAD_SEARCH_QUERY')<{ query: SearchQuery }>(),
  renameQuery: action('RENAME_QUERY')<{ oldName: string; newName: string }>(),
  resetSearchFilter: action('RESET_SEARCH_FILTER')<void>(),
  saveSearchQuery: asyncAction(
    'SAVE_SEARCH_QUERY_REQUEST',
    'SAVE_SEARCH_QUERY_SUCCESS',
    'SAVE_SEARCH_QUERY_ERROR',
  )<void, { name: string }, Error>(),
  updateSearchQuery: action('UPDATE_SEARCH_QUERY')<{
    path: string[];
    value: string | number;
  }>(),
};

export type SearchFilterAction = ActionType<typeof Creators>;

// ** Initial State

const EMPTY_QUERY: SearchQuery = {
  name: null,
  todos: {},
  tags: {},
  priority: {
    A: 0,
    B: 0,
    C: 0,
  },
  isScheduled: false,
  hasDeadline: false,
  searchTerm: '',
};

export const INITIAL_STATE: IS = Immutable({
  query: EMPTY_QUERY,
  savedItems: [],
  visibilityFilter: {
    narrowToFile: undefined,
    sorting: undefined,
  },
});

// ** Selectors Helpers

const createEmptyFilter = R.pipe(R.map(R.flip(R.pair)(0)), R.fromPairs);

// ** Selectors

// *** Local selectors

const isQueryEmpty = createSelector([(state: IS) => state.query], (query) =>
  R.equals(query, INITIAL_STATE.query),
);

const selectors = {
  currentSearchQuery: (state: IS) => state.query,
  getQueryName: (state: IS) => state.query.name,
  isQueryEmpty,
  savedItems: (state: IS) => state.savedItems,
};

const parametrizedSelectors = {
  itemExists: (name: string) => (state: IS) =>
    R.find(R.propEq('name', name), state.savedItems),
};

const globalizedSelectors = {
  ...globalizeSelectors('searchFilter')(selectors),
  ...globalizeParametrizedSelectors('searchFilter')(parametrizedSelectors),
};

// *** Global selectors

const emptyTodoFilter = createSelector(
  [SettingsSelectors.taskStates],
  (taskStates) => {
    return createEmptyFilter(taskStates);
  },
);

const emptyTagsFilter = createSelector(
  [SettingsSelectors.userTags, OrgDataSelectors.getTags],
  (userTags, orgDataTags) => {
    return createEmptyFilter(R.concat(userTags, orgDataTags));
  },
);

const getQuery = createSelector(
  [emptyTagsFilter, emptyTodoFilter, globalizedSelectors.currentSearchQuery],
  (emptyTags, emptyTodos, currentQuery) => {
    return currentQuery.merge({
      todos: R.merge(emptyTodos, currentQuery.todos),
      tags: R.merge(emptyTags, currentQuery.tags),
    });
  },
);

// *** Bundle selectors

const SearchFilterSelectors = {
  ...globalizedSelectors,
  getQuery,
};

// ** Reducers

const reducer = (state = INITIAL_STATE, action: SearchFilterAction) => {
  switch (action.type) {
    case getType(Creators.renameQuery): {
      const { oldName, newName } = action.payload;
      const itemIndex = R.findIndex(
        R.propEq('name', oldName),
        state.savedItems,
      );
      const savedItems = R.clone(state.savedItems);
      savedItems[itemIndex].name = newName;
      return state.merge({
        savedItems,
      });
    }

    case getType(Creators.deleteQuery): {
      const { name } = action.payload;
      return Immutable(
        R.evolve(
          {
            savedItems: R.reject(R.propEq('name', name)),
          },
          state,
        ),
      );
    }

    case getType(Creators.saveSearchQuery.success): {
      const { name } = action.payload;
      return state
        .merge({
          savedItems: R.append({ ...state.query, name }, state.savedItems),
        })
        .setIn(['query', 'name'], name);
    }

    case getType(Creators.loadSearchQuery): {
      const { query } = action.payload;
      return state.merge({ query });
    }

    case getType(Creators.updateSearchQuery): {
      const { path, value } = action.payload;
      let ns;
      if (value === 0) {
        const st = R.dissocPath(R.concat(['query'], path), state);
        ns = Immutable(st);
      } else {
        ns = state.setIn(R.concat(['query'], path), value);
      }
      return ns.setIn(['query', 'name'], null);
    }

    case getType(Creators.resetSearchFilter): {
      return state.merge({ query: EMPTY_QUERY });
    }

    default:
      return state;
  }
};

// * Exports

export { reducer, SearchFilterSelectors };
export default Creators;
