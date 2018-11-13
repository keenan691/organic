// * NavigateSagas.ts

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
import { call, put } from 'redux-saga/effects';
import CaptureActions from '../redux/CaptureRedux';
import LoadSagas from './LoadSagas';

// * Code

export function* openCaptureScreen({ navigator, fileId, nodeId }) {
  const data = {
    id: 'node is',
    headline: 'added node',
    content: '',
    tags: [],
    level: 1,
    position: 0,
  };
  yield put(CaptureActions.captureSuccess(data));
}

export function* openOrgFile({ fileId, nodeId }) {
  if (fileId) {
    const { fileData, nodesList } = yield call(
      OrgApi.getFileAsPlainObject,
      fileId,
    );
    yield* LoadSagas.loadNodes(nodesList);
  }
}

function* visitCaptureTemplate(action) {
  const { item: { target }, navigator } = action.payload;
  let ctNodeId;
  if (target.headline) {
    const nodeId = yield* LoadSagas.getOrCreateNode(target);
    ctNodeId = nodeId;
  }

  const props = {
    screen: 'OrgFileBrowserScreen',
    passProps: {
      contentFoldingLevel: 1,
      fileId: target.fileId,
      foldingLevel: 1,
      navigationStack: 'notes',
      nodeId: ctNodeId,
    },
  };

  navigator.push(props);
}

// * Export

export default {
  CaptureActions,
  openOrgFile,
  visitCaptureTemplate,
};
