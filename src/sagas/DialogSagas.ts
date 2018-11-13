// * DialogSagas.ts

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
import DialogAndroid from 'react-native-dialogs';
import { getFormValues, initialize } from 'redux-form';
import { call, put, select } from 'redux-saga/effects';
import { AgendaSelectors } from '../redux/AgendaRedux';
import CaptureActions, { CaptureSelectors } from '../redux/CaptureRedux';
import NavigationRedux, { NavigationSelectors } from '../redux/NavigationRedux';
import OrgSearcherRedux from '../redux/OrgSearcherRedux';
import OrgDataRedux from '../redux/OrgDataRedux';
import OrgSearcherFilterRedux, {
  SearchFilterSelectors,
} from '../redux/OrgSearcherFilterRedux';
import { vibrate } from '../vibrations';
import { textInputDialog, confirmDialog } from './Helpers';
import NotebookSagas from './NotebookSagas';
import { CaptureTemplate } from '../redux/types';

// * Code

export function* selectCaptureTemplate(action) {
  const { id } = action.payload;
  let ct;

  // Null is used when adding to note to currently visited node
  if (id !== null) {
    ct = yield select(CaptureSelectors.captureTemplate(id));
    yield put(NavigationRedux.loadBreadcrumbs({ target: ct.target }));
    // yield put(NavigationRedux.selectCaptureTemplate())
  } else {
    ct = yield select(getFormValues('capture'));
  }

  // Agenda Capture
  const cType = yield select(NavigationSelectors.getCaptureType);
  switch (cType) {
    case 'agendaCapture':
      const date = yield select(AgendaSelectors.getSelectedDay);
      ct = R.merge(ct, {
        timestamps: [
          {
            type: 'scheduled',
            date,
          },
        ],
      });
      break;
  }

  yield put(initialize('capture', ct));
}

interface DialogAction {
  payload: {
    item: CaptureTemplate; // item id
    action?: string; // actionId
  };
}

export function* showCaptureTemplateActions(raction: DialogAction) {
  const { item, action } = raction.payload;
  vibrate();
  let actionId;

  if (action) {
    actionId = action;
  } else {
    const { selectedItem } = yield call(
      DialogAndroid.showPicker,
      `Select Action for "${item.name}":`,
      null,
      {
        positiveText: '',
        items: [
          { label: 'Rename', id: 'rename' },
          { label: 'Delete', id: 'delete' },
        ],
      },
    );

    if (selectedItem) {
      actionId = selectedItem.id;
    }
  }

  switch (actionId) {
    case 'rename':
      const userInput = yield* textInputDialog(
        'Rename capture template',
        `Enter new name for capture template "${item.name}"`,
      );
      if (userInput) {
        const exists = yield select(
          CaptureSelectors.captureTemplateExists(userInput),
        );

        if (!exists) {
          yield put(
            CaptureActions.addCaptureTemplate.success({
              name: userInput,
              target: item.target,
              content: R.omit(['target', 'name'], item),
            }),
          );
          yield put(CaptureActions.deleteCaptureTemplate({ name: item.name }));
        } else {
          const { action, text } = yield call(
            DialogAndroid.alert,
            'Rename capture template',
            `Capture template named "${userInput}" already exists. Do you want to overwrite it ?`,
            {
              positiveText: 'Yes',
              negativeText: 'No',
            },
          );
          if (action === DialogAndroid.actionPositive) {
            yield put(
              CaptureActions.addCaptureTemplate.success({
                name: userInput,
                target: item.target,
                content: R.omit(['target', 'name'], item),
              }),
            );
            yield put(CaptureActions.deleteCaptureTemplate(item.name));
          }
        }
      }
      break;

    case 'delete':
      let { action } = yield call(
        DialogAndroid.alert,
        'Delete',
        `Do you really want to delete "${item.name}" capture template `,
        {
          positiveText: 'yes',
          negativeText: 'no',
        },
      );

      switch (action) {
        case DialogAndroid.actionPositive:
          yield put(CaptureActions.deleteCaptureTemplate({ name: item.name }));
          break;
        default:
      }
      break;
    default:
  }
}

export function* showFileActionsDialog({ item }) {
  vibrate();
  let actions = [
    { label: 'Rename', id: 'rename' },
    { label: 'Delete', id: 'delete' },
  ];

  if (item.path) {
    actions = actions.concat([
      { label: 'Force load', id: 'forceLoadFile' },
      { label: 'Force write', id: 'forceWrite' },
    ]);
  } else {
    actions = actions.concat([{ label: 'Export', id: 'export' }]);
  }

  const { action, selectedItem } = yield call(
    DialogAndroid.showPicker,
    `Select Action:`,
    null,
    {
      positiveText: '',
      items: actions,
    },
  );

  if (selectedItem) {
    let res;
    switch (selectedItem.id) {
      case 'forceLoadFile':
        res = yield* confirmDialog(
          'Force load',
          'Local changes will be forgotten. Do you really want to reload file?',
        );
        if (res) {
          yield* NotebookSagas.deleteFile(item);
          yield* NotebookSagas.addOrgFile({ filepath: item.path });
        }
        break;

      case 'export':
        DialogAndroid.alert(
          'Export functionality in not available in this version of app.',
        );
        break;

      case 'rename':
        const userInput = yield* textInputDialog(
          'Rename Notebook',
          `Enter new name for notebook "${item.metadata.TITLE}"`,
        );
        if (userInput) {
          let renamedItem = R.assocPath(['metadata', 'TITLE'], userInput, item);
          renamedItem.isChanged = true;
          yield put(OrgDataRedux.updateFile(renamedItem));
          yield call(
            OrgApi.updateFile,
            renamedItem.id,
            R.omit(['id', 'toc', 'nodesData'], renamedItem),
          );
        }
        break;

      case 'delete':
        res = yield* confirmDialog(
          'Delete',
          'Do you really want to delete file?',
        );
        if (res) {
          yield* NotebookSagas.deleteFile(item);
        }

        break;
      default:
    }
  }
}

export function* showSavedSearchesActions(
  action: ReturnType<typeof OrgSearcherRedux.showSavedSearchesActions>,
) {
  vibrate();
  const { item } = action.payload;

  const { selectedItem } = yield call(
    DialogAndroid.showPicker,
    `Select Action for "${item.name}":`,
    null,
    {
      positiveText: '',
      items: [
        { label: 'Rename', id: 'rename' },
        { label: 'Delete', id: 'delete' },
      ],
    },
  );

  if (selectedItem) {
    switch (selectedItem.id) {
      case 'rename': {
        const userInput = yield* textInputDialog(
          'Rename search',
          `Enter new name for search "${item.name}"`,
        );
        if (userInput) {
          const exists = yield select(
            SearchFilterSelectors.itemExists(userInput),
          );

          if (!exists) {
            yield put(
              OrgSearcherFilterRedux.renameQuery({
                oldName: item.name,
                newName: userInput,
              }),
            );
          } else {
            const { action, text } = yield call(
              DialogAndroid.alert,
              'Rename capture template',
              `Capture template named "${userInput}" already exists. Do you want to overwrite it ?`,
              {
                positiveText: 'Yes',
                negativeText: 'No',
              },
            );
            if (action === DialogAndroid.actionPositive) {
              yield put(
                OrgSearcherFilterRedux.deleteQuery({ name: userInput }),
              );
              yield put(
                OrgSearcherFilterRedux.renameQuery({
                  oldName: item.name,
                  newName: userInput,
                }),
              );
            }
          }
        }
        break;
      }

      case 'delete': {
        const { action } = yield call(
          DialogAndroid.alert,
          'Delete',
          `Do you really want to delete "${item.name}" query`,
          {
            positiveText: 'yes',
            negativeText: 'no',
          },
        );

        switch (action) {
          case DialogAndroid.actionPositive:
            yield put(OrgSearcherFilterRedux.deleteQuery({ name: item.name }));
            break;
        }
        break;
      }
    }
  }
}

// * Export

export default {
  showFileActionsDialog,
  showSavedSearchesActions,
  showCaptureTemplateActions,
  selectCaptureTemplate,
};
