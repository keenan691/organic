// * CaptureSagas.ts

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
import { Keyboard } from 'react-native';
import DialogAndroid from 'react-native-dialogs';
import { getFormValues } from 'redux-form';
import { call, put, select } from 'redux-saga/effects';
import { NavigationActions } from '../navigation';
import CaptureActions, { CaptureSelectors } from '../redux/CaptureRedux';
import OrgDataRedux, { OrgDataSelectors } from '../redux/OrgDataRedux';
import { Colors } from '../themes';
import { prepareNoteForDb } from './Helpers';
import NodeSagas from './NodeSagas';

// * Code

function* addCaptureTemplate(raction) {
  const { target, after } = raction.payload;
  let ctTarget;
  let ctContent;
  if (target.target) {
    ctTarget = target.target;
    ctContent = R.omit(['target', 'name'], target);
    ctName = target.name;
  } else {
    // Only target for new template
    ctTarget = target;
    ctContent = {};
  }
  const { action, text } = yield call(
    DialogAndroid.prompt,
    'Add Capture Template',
    'Enter name for new capture template:',
    {
      neutralText: 'Cancel',
    },
  );

  switch (action) {
    case DialogAndroid.actionPositive:
      if (R.isNil(text)) {
        yield call(DialogAndroid.alert, 'Add Capture Template', 'Empty name');
      } else {
        const exists = yield select(
          CaptureSelectors.captureTemplateExists(text),
        );
        if (!exists) {
          yield put(
            CaptureActions.addCaptureTemplate.success({
              name: text,
              target: ctTarget,
              content: ctContent,
            }),
          );
          NavigationActions.showSnackbar(
            `Added capture template with name ${text}`,
          );
        } else {
          const { action } = yield call(
            DialogAndroid.alert,
            'Add Capture Template',
            `Capture template named "${text}" already exists. Do you want to overwrite it ?`,
            {
              positiveText: 'Yes',
              negativeText: 'No',
            },
          );
          if (action === DialogAndroid.actionPositive) {
            yield put(
              CaptureActions.addCaptureTemplate.success({
                name: text,
                target: ctTarget,
                content: ctContent,
              }),
            );

            NavigationActions.showSnackbar(
              `Added capture template with name ${text}`,
            );
          }
        }
      }
      break;
    default:
  }
  after && after();
}

function* cancelCapture(action) {
  const { navigator } = action.payload;
  const navigationStackHistory = yield select(
    OrgDataSelectors.navigationStackHistory,
  );
  if (navigationStackHistory[0] !== 'capture') {
    return;
  }

  const link =
    navigationStackHistory.length > 1 ? navigationStackHistory[1] : 'notes';

  Keyboard.dismiss();
  yield call(navigator.handleDeepLink, { link });
}

function* confirmCapture(raction) {
  const { navigator } = raction.payload;
  const { target, name, ...node } = yield select(getFormValues('capture'));

  const type = node.id ? 'edit' : 'new';
  const navigationStackHistory = yield select(
    OrgDataSelectors.navigationStackHistory,
  );

  const link =
    navigationStackHistory.length > 1 ? navigationStackHistory[1] : 'notes';

  let addedNode;

  switch (type) {
    case 'edit':
      yield put(OrgDataRedux.updateNode(node, [node.id], link));
      break;

    case 'new':
      addedNode = (yield call(OrgApi.addNodes, [prepareNoteForDb(node)], {
        ...target,
      }))[0];

      // yield put(OrgDataRedux.updateNode(addedNode));
      yield* NodeSagas.updateNode({ node: addedNode, isNew: true });

      // TODO zbatchować akcje, aby uniknę wielokrotych updatów
      const fileNodes = yield select(
        OrgDataSelectors.getFileNodes(addedNode.fileId),
      );

      // Update idików - dzieje się tylko przy dodawaniu a nie przy updacie
      // Inna sprawa to timestampy - one mogą się zmieniac przy updacie więc spadaje do updateNode
      const newIds = R.pipe(
        R.values,
        R.sortBy(R.prop('position')),
        R.map(R.prop('id')),
      )(fileNodes);
      const newTOC = R.pipe(
        R.filter(R.propEq('level', 1)),
        R.map(R.prop('id')),
      )(fileNodes);
      yield put([
        OrgDataRedux.addToLastCaptured(addedNode),
        OrgDataRedux.updateFileIds(addedNode.fileId, newIds, newTOC),
      ]);
  }

  yield call(navigator.handleDeepLink, { link });

  /* ------------- Create success message ------------- */

  let message;

  if (type === 'edit') {
    message = 'Edited note saved succesfully.';
  } else if (type === 'add' && name) {
    message = `Added note to ${name}.`;
  } else {
    message = 'Added note.';
  }

  yield call(navigator.showSnackbar, {
    text: message,
    textColor: Colors.bg, // optional
    backgroundColor: Colors.primary, // optional
    duration: 'short', // default is `short`. Available options: short, long, indefinite
  });
}

export function* saveCaptureTemplate({ target, after }) {
  let ctTarget;
  let ctContent;
  let ctName;
  if (target.target) {
    ctTarget = target.target;
    ctContent = R.omit(['target', 'name'], target);
    ctName = target.name;
  } else {
    // Only target for new template
    ctTarget = target;
    ctContent = {};
  }

  yield put(
    CaptureActions.addCaptureTemplate.success({
      name: ctName,
      target: ctTarget,
      content: ctContent,
    }),
  );
}

// * Exports

export default {
  addCaptureTemplate,
  cancelCapture,
  confirmCapture,
  saveCaptureTemplate,
};
