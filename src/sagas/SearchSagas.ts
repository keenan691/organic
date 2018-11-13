// * SearchSagas.ts

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
import { call, put, select } from 'redux-saga/effects';
import { NavigationActions } from '../navigation';
import OrgSearcherFilterRedux, {
  SearchFilterSelectors,
} from '../redux/OrgSearcherFilterRedux';
import { vibrate } from '../vibrations';
import { alert, textInputDialog } from './Helpers';
import LoadSagas from './LoadSagas';
import OrgSearcherRedux from '../redux/OrgSearcherRedux';

// * Sagas

function* search(action: ReturnType<typeof OrgSearcherRedux.search>) {
  const query = action.payload;
  const results = yield call(OrgApi.search, query);
  yield* LoadSagas.loadNodes(results, 'searchResults');
}

function* saveSearch() {
  let name = yield* textInputDialog('Save search query', 'Enter name:');
  if (!R.isNil(name)) {
    const savedQueries = yield select(SearchFilterSelectors.savedItems);
    const nameExists = R.find(R.propEq('name', name), savedQueries);
    if (nameExists) {
      name = yield* alert(
        'Save search query',
        `Search query with name '${name}' already exists.`,
      );
    } else {
      yield put(OrgSearcherFilterRedux.saveSearchQuery.success({ name }));
      vibrate();
      NavigationActions.showSnackbar(
        `Search query was saved with name '${name}'`,
      );
    }
  }
}

// * Export

export default {
  search,
  saveSearch,
};
