// * OrgSearcherRedux.ts

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

import { SearchQuery } from 'org-mode-connection';
import Immutable from 'seamless-immutable';
import { ActionType, createStandardAction as action } from 'typesafe-actions';
import { globalizeSelectors } from './Helpers';
import { SavedSearchFilter, SearchInitialState as IS } from './types';

// ** Action Creators

const Creators = {
  search: action('SEARCH')<{ query: SearchQuery }>(),
  // TODO possibly move to search filter
  showSavedSearchesActions: action('SHOW_SAVED_SEARCHES_ACTIONS')<{
    item: SavedSearchFilter;
  }>(),
};

export type SearchAction = ActionType<typeof Creators>;

// ** Initial State

export const INITIAL_STATE: IS = Immutable({});

// ** Selectors

const OrgSearcherSelectors = globalizeSelectors('search')({});

// ** Reducer

const reducer = (state = INITIAL_STATE, action: SearchAction) => {
  return state;
};

// * Exports

export { reducer, OrgSearcherSelectors };
export default Creators;
