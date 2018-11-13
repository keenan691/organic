// * NodeSagas.ts

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
import { getFormValues } from 'redux-form';
import { END, eventChannel } from 'redux-saga';
import { call, put, select, take } from 'redux-saga/effects';
import { NavigationActions, showEditModal } from '../navigation';
import OrgDataRedux, { OrgDataSelectors } from '../redux/OrgDataRedux';
import { Colors } from '../themes';
import AgendaTransforms, { setTodo } from '../transforms/AgendaTransforms';
import TreeTransforms from '../transforms/TreeTransforms';
import { confirmDialog, prepareNoteForDb } from './Helpers';
import SyncSagas from './SyncSagas';
import CaptureSagas from './CaptureSagas';

// * Code

function* updateNode({ node, nodesIds, isNew = false }) {
  // HACK because node sent from capture or edit   donot has no nodesIds
  const updateActions = [];

  if (node.id) {
    nodesIds = [node.id];
  }

  /* ------------- get changes ------------- */

  let changes;
  if (nodesIds.length === 1 && !isNew) {
    // Its comming from edit screen and it icontains whole node
    // we have to compute diff
    const id = nodesIds[0];
    const originalNode = yield select(OrgDataSelectors.getNode(id));
    changes = R.pipe(
      R.useWith(R.difference, [R.toPairs, R.toPairs]),
      R.fromPairs,
    )(node, originalNode);
  } else {
    changes = node;
  }

  if (changes.timestamps) {
    /* ------------- timestamps rehydrate ------------- */
    // When clear is set at datetime modal date is set to undefined
    // It should be filtered out
    changes = {
      ...changes,
      timestamps: changes.timestamps.filter((ts) => ts.date != undefined),
    };

    updateActions.push(OrgDataRedux.mergeNodeChanges(changes, nodesIds));
    updateActions.push(OrgDataRedux.rescheduleAgenda(changes, nodesIds));
    yield put(updateActions);
    const timestamps = R.concat(
      yield select(OrgDataSelectors.getTimestamps),
      yield select(OrgDataSelectors.getDayTimestamps),
    );

    yield put(
      OrgDataRedux.openIds(timestamps.map((ts) => ts.nodeId), 'agenda'),
    );
  } else {
    updateActions.push(OrgDataRedux.mergeNodeChanges(changes, nodesIds));
    yield put(updateActions);
  }

  /* ------------- Update Files ------------- */

  yield* SyncSagas.markFilesAsChanged(nodesIds);

  /* ------------- Update realm database ------------- */

  const preparedNode = prepareNoteForDb(node);

  for (var i = 0; i < nodesIds.length; i++) {
    yield call(OrgApi.updateNodeById, nodesIds[i], preparedNode);
  }
}

function* updateNodesAgenda(ids, num, interval, type) {
  const actions = [];
  const nodes = yield select(OrgDataSelectors.getNodes);
  const updatedNodes = [];
  for (var i = 0; i < ids.length; i++) {
    const n = AgendaTransforms.move(num, interval)(nodes[ids[i]], type);
    updatedNodes.push(n);
  }

  yield put(OrgDataRedux.mergeNodeChanges(updatedNodes, ids));

  for (var i = 0; i < ids.length; i++) {
    const n = updatedNodes[i];
    yield call(OrgApi.updateNodeById, n.id, prepareNoteForDb(n));
  }

  yield* SyncSagas.markFilesAsChanged(ids);
}

function* runNodeAction({
  actionName,
  ids,
  navigator,
  node,
  navigationStack,
  doAfterAction,
  doBeforeAction,
  payload,
}) {
  let res;
  let channel;
  // When capture node is fetched from capture form
  if (navigationStack === 'capture') {
    node = yield select(getFormValues('capture'));
  }

  switch (actionName) {
    /* ------------- capture actions ------------- */

    case 'showCaptureSideMenu':
      const ct = yield select(getFormValues('capture'));
      channel = eventChannel((emitter) => {
        navigator.showContextualMenu({
          rightButtons: [
            {
              title: 'Save',
              showAsAction: 'always',
            },
            {
              title: 'Save as',
              showAsAction: 'always',
            },
          ],
          onButtonPressed: (index) => {
            emitter({ index });
            emitter(END);
          },
        });
        return () => {};
      });

      while (true) {
        const { index } = yield take(channel);
        switch (index) {
          case 0:
            yield* CaptureSagas.saveCaptureTemplate({
              target: ct,
            });

            navigator.showSnackbar({
              text: `Capture template ${ct.name} saved succesfully`,
              textColor: Colors.white, // optional
              backgroundColor: Colors.button, // optional
              duration: 'short', // default is `short`. Available options: short, long, indefinite
            });
            break;
          case 1:
            yield* CaptureSagas.addCaptureTemplate({
              target: ct,
            });
            navigator.showSnackbar({
              text: `Capture template ${ct.name} added succesfully`,
              textColor: Colors.white, // optional
              backgroundColor: Colors.button, // optional
              duration: 'short', // default is `short`. Available options: short, long, indefinite
            });
            break;
        }
      }
      break;

    /* ------------- agenda actions ------------- */

    case 'addToAgenda':
      navigator.handleDeepLink({
        link: `capture`,
        payload: {
          type: 'agendaCapture',
          date: payload.date,
        },
      });
      break;

    case 'moveToTomorrow':
      // console.tron.log(node)
      // HACK z agendy dochodzi dodatkkowy prop do noda "type"
      // pojawia sie tam bo nie ma jak inaczej przesłac tych danych
      // tzn można ale wymaga to zbyt dóżej liczby przeróbek
      // nie wiadomo jakie bugi spowoduje

      yield put(
        OrgDataRedux.updateNode(
          AgendaTransforms.move(1, 'd')(node, node.type),
          ids,
        ),
      );
      break;

    case 'moveToYesterday':
      yield put(
        OrgDataRedux.updateNode(
          AgendaTransforms.move(-1, 'd')(node, node.type),
          ids,
        ),
      );
      break;

    case 'agenda':
      channel = eventChannel((emitter) => {
        navigator.showContextualMenu({
          rightButtons: agendaButtons,
          onButtonPressed: (index) => {
            emitter({ index });
            emitter(END);
          },
        });
        return () => {};
      });

      while (true) {
        const { index } = yield take(channel);
        switch (index) {
          case 0:
            // Schedule
            doBeforeAction && doBeforeAction();
            showEditModal(navigator, {
              nodesIds: ids,
              node,
              editField: 'timestamps',
              type: 'schedule',
              title: 'Schedule',
              navigationStack,
              onExit: doAfterAction,
            });
            break;
          case 1:
            // Deadline
            doBeforeAction && doBeforeAction();
            showEditModal(navigator, {
              nodesIds: ids,
              node,
              editField: 'timestamps',
              type: 'deadline',
              title: 'Deadline',
              navigationStack,
              onExit: doAfterAction,
            });
            break;
          case 2:
            // +2d
            yield* updateNodesAgenda(ids, 2, 'd', 'scheduled');
            break;
          case 3:
            // +1d

            yield* updateNodesAgenda(ids, 1, 'd', 'scheduled');
            break;
          case 4:
            // .

            yield* updateNodesAgenda(ids, 0, 'd', 'scheduled');
            break;
        }
      }
      break;
    /* ------------- move in tree structure ------------- */

    case 'moveUp':
      yield* moveNode('up', ids, navigationStack);
      break;

    case 'moveDown':
      yield* moveNode('down', ids, navigationStack);
      break;

    case 'moveLeft':
      yield* moveNode('left', ids, navigationStack);
      break;

    case 'moveRight':
      yield* moveNode('right', ids, navigationStack);
      break;

    case 'moveUpNote':
      yield* moveNode('up', ids, navigationStack, false);
      break;

    case 'moveDownNote':
      yield* moveNode('down', ids, navigationStack, false);
      break;

    case 'moveLeftNote':
      yield* moveNode('left', ids, navigationStack, false);
      break;

    case 'moveRightNote':
      yield* moveNode('right', ids, navigationStack, false);
      break;

    /* ------------- edit actions ------------- */

    case 'delete':
      res = yield* confirmDialog(
        'Delete',
        `Really delete ${ids.length} nodes?`,
      );
      if (res) {
        for (var i = 0; i < ids.length; i++) {
          NavigationActions.popScreens({ nodeId: ids[i] });
          yield call(OrgApi.deleteNodeById, ids[i]);
        }
        yield* SyncSagas.markFilesAsChanged(ids);
        yield put(OrgDataRedux.removeNodes(ids));
        yield put(OrgDataRedux.deleteNodes(ids));
        doAfterAction && doAfterAction();
      }
      break;

    case 'todo':
      doBeforeAction && doBeforeAction();
      showEditModal(navigator, {
        nodesIds: ids,
        node,
        editField: 'todo',
        title: 'Select todos',
        navigationStack,
        onExit: doAfterAction,
      });
      break;

    case 'cycleTodoState':
      if (node.todo && node.todo !== 'DONE') {
        yield put(
          OrgDataRedux.updateNode(R.merge(node, setTodo('DONE', node)), ids),
        );
      } else {
        showEditModal(navigator, {
          nodesIds: ids,
          node,
          editField: 'todo',
          title: 'Select todos state',
          navigationStack,
          onExit: doAfterAction,
        });
      }
      break;

    case 'edit':
      doBeforeAction && doBeforeAction();
      navigator.handleDeepLink({
        link: `capture/visitedNode`,
        payload: {
          targetNode: node,
          type: 'edit',
          navigationStack,
        },
      });
      break;

    case 'tags':
      doBeforeAction && doBeforeAction();
      showEditModal(navigator, {
        nodesIds: ids,
        node,
        editField: 'tags',
        title: 'Select tags',
        navigationStack,
        onExit: doAfterAction,
      });
      break;

    case 'priority':
      doBeforeAction && doBeforeAction();
      showEditModal(navigator, {
        nodesIds: ids,
        node,
        editField: 'priority',
        title: 'Select priority',
        navigationStack,
        onExit: doAfterAction,
      });
      break;
  }
}

function* moveNode(direction, ids, navigationStack, withDescendants = true) {
  // TODO do updates to all stacks with this fileId
  // In this moment we are sorting only stack when the changes occured

  const loadedNodesData = yield select(OrgDataSelectors.getNodes);
  let loadedNodesIds = yield select(OrgDataSelectors.getLoadedNodesIds);
  loadedNodesIds = loadedNodesIds[navigationStack];

  /* ------------- compute changes ------------- */
  let changes = yield call(
    TreeTransforms.move,
    {
      loadedNodesData,
      loadedNodesIds,
    },
    {
      movedNodeId: ids[0],
      direction,
      withDescendants,
    },
  );

  if (changes.length === 0) {
    return;
  }

  const fileId = changes[0].fileId;
  const changesDict = R.indexBy(R.prop('id'), changes);

  /* ------------- update data ------------- */
  yield put(OrgDataRedux.updateLoadedNodes(changesDict));

  /* ------------- reorder ids ------------- */
  const newIds = R.sortBy(
    (id) =>
      changesDict[id] ? changesDict[id].position : loadedNodesData[id].position,
    loadedNodesIds,
  );

  const newTOC = R.pipe(
    R.filter(
      (id) =>
        changesDict[id]
          ? changesDict[id].level === 1
          : loadedNodesData[id].level === 1,
    ),
  )(newIds);

  yield put(OrgDataRedux.updateFileIds(fileId, newIds, newTOC));

  yield* SyncSagas.markFilesAsChanged([ids[0]]);

  /* ------------- update realm database ------------- */
  for (var i = 0; i < changes.length; i++) {
    yield call(
      OrgApi.updateNodeById,
      changes[i].id,
      R.pick(['position', 'level'], changes[i]),
    );
  }
}

const agendaButtons = [
  {
    title: 'S',
    showAsAction: 'always',
  },
  {
    title: 'D',
    showAsAction: 'always',
  },
  {
    title: '+2d',
    showAsAction: 'always',
  },

  {
    title: '+1d',
    showAsAction: 'always',
  },
  {
    title: 'NOW',
    showAsAction: 'always',
  },
];

function* toggleMark({ node }) {
  if (node) {
    let tags;
    if (node.tags.includes('PIN')) {
      tags = R.without(['PIN'], node.tags);
    } else {
      tags = R.concat(node.tags, ['PIN']);
    }
    yield put(OrgDataRedux.updateNode({ tags }, [node.id]));
  }
}

// * Export

export default {
  runNodeAction,
  toggleMark,
  updateNode,
  updateNodesAgenda,
  moveNode,
};
