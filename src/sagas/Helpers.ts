// * Helpers.ts<sagas>

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

import R from 'ramda';
import { call } from 'redux-saga/effects';
import DialogAndroid from 'react-native-dialogs';

// * Code

export const prepareNoteForDb = R.evolve({
  drawers: (drawers) =>
    typeof drawers === 'object' ? JSON.stringify(drawers) : drawers,
  tags: R.map((tag) => ({ name: tag, isContextTag: false })),
});

export function* alert(title, msg) {
  yield call(DialogAndroid.alert, title, msg);
}

export function* confirmDialog(title, msg) {
  const { action } = yield call(DialogAndroid.alert, title, msg, {
    positiveText: 'yes',
    negativeText: 'no',
  });

  switch (action) {
    case DialogAndroid.actionPositive:
      return true;
  }
}

export function* textInputDialog(title, msg) {
  const { action, text } = yield call(DialogAndroid.prompt, title, msg, {
    neutralText: 'cancel',
  });

  switch (action) {
    case DialogAndroid.actionPositive:
      return text;
    default:
  }
}
