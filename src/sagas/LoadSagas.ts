// * LoadSagas.ts

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

// *** TODO Add docs

// * Imports

import { OrgApi } from 'org-mode-connection';
import R from 'ramda';
import { call, put, select } from 'redux-saga/effects';
import NavigationRedux from '../redux/NavigationRedux';
import OrgDataRedux, { OrgDataSelectors } from '../redux/OrgDataRedux';
import SyncRedux from '../redux/SyncRedux';
import { getFileTitle } from '../utils/files';
import { vibrate } from '../vibrations';
import NodeSagas from './NodeSagas';

// * Code

export function* rehydrateNewNodeCache(node) {
  yield* NodeSagas.updateNode({ node });
  const fileNodes = yield select(OrgDataSelectors.getFileNodes(node.fileId));
  const newIds = R.pipe(
    R.values,
    R.sortBy(R.prop('position')),
    R.map(R.prop('id')),
  )(fileNodes);
  const newTOC = R.pipe(R.filter(R.propEq('level', 1)), R.map(R.prop('id')))(
    fileNodes,
  );
  yield put(OrgDataRedux.updateFileIds(node.fileId, newIds, newTOC));
}

function* getOrCreateNode(target) {
  const [node, created] = yield call(OrgApi.getOrCreateNodeByHeadline, target);
  if (created) {
    yield* rehydrateNewNodeCache(node);
  }
  return node.id;
}

export function* loadAgenda(action) {
  const range = yield select(OrgDataSelectors.getTimestampsRange);
  const { agendaItems, dayAgendaItems, nodes } = yield call(
    OrgApi.getAgendaAsPlainObject,
    range,
  );
  yield* loadNodes(nodes, 'agenda');
  yield put(OrgDataRedux.updateTimestamps(agendaItems, dayAgendaItems, range));
}

export function* loadBreadcrumbs(action) {
  const { target } = action.payload;
  let file;
  let ancestors = [];

  file = yield select(OrgDataSelectors.getFile(target.fileId));

  if (target.nodeId || target.headline) {
    const nodeId = yield* getOrCreateNode(target);
    ancestors = yield call(OrgApi.getAncestorsAsPlainObject, nodeId);
  }

  yield put(
    NavigationRedux.updateNavigation({
      breadcrumbs: [
        {
          fileId: target.fileId,
          headline: getFileTitle(file),
        },
        ...R.map(R.pick(['id', 'headline']), ancestors),
      ],
    }),
  );
}

export function* loadNodes(nodesList, stack) {
  yield put(OrgDataRedux.updateLoadedNodes(R.indexBy(R.prop('id'), nodesList)));

  yield put(OrgDataRedux.openIds(nodesList.map((o) => o.id), stack));
  yield put(OrgDataRedux.stackLoaded(stack));
}

function* loadOrgData(updateChangedFiles = true) {
  const files = yield call(OrgApi.getAllFilesAsPlainObject);
  const tags = yield call(OrgApi.getTagsAsPlainObject);
  const tocs = yield call(OrgApi.getTocs);

  // Load Files and Tags
  yield put(
    OrgDataRedux.getOrgDataSuccess(
      R.map(R.omit(['nodesData', 'isChanged']), files),
      tags,
    ),
  );

  // Rehydrate locally changed files
  if (updateChangedFiles) {
    const filesIds = R.into(
      [],
      R.compose(
        R.filter(R.propEq('isChanged', true)),
        R.map((file) => file.id),
      ),
      files,
    );

    yield put(SyncRedux.markAsChanged({ filesIds }));
  }
  // Load TOCS
  for (var i = 0; i < files.length; i++) {
    const fileId = files[i].id;
    yield put(OrgDataRedux.updateFileIds(fileId, null, tocs.ids[fileId]));
    yield put(OrgDataRedux.updateLoadedNodes(tocs.data));
  }

  // Load Pinned Nodes
  yield* loadPinnedNodes();
  yield put(OrgDataRedux.loadWeekAgenda(new Date()));
}

export function* loadPinnedNodes() {
  const pinned = yield call(OrgApi.search, {
    todos: {},
    tags: { PIN: 1 },
    priority: {},
    isScheduled: false,
    hasDeadline: false,
    searchTerm: '',
  });

  yield put(
    OrgDataRedux.updateLoadedNodes(
      R.indexBy(R.prop('id'), pinned),
      'markedPlaces',
    ),
  );

  yield put(OrgDataRedux.openIds(pinned.map((o) => o.id), 'markedPlaces'));
}

export function* loadRelatedNodes({ nodeId }) {
  const nodesList = yield call(OrgApi.getRelatedNodes, nodeId);

  yield* loadNodes(nodesList);
}

export function* loadTOC({ fileId, navigator }) {
  vibrate();
  yield call(navigator.handleDeepLink, { link: `notes/${fileId}` });
}

// * Export

export default {
  getOrCreateNode,
  loadAgenda,
  loadBreadcrumbs,
  loadNodes,
  loadOrgData,
  loadPinnedNodes,
  loadRelatedNodes,
  loadTOC,
};
