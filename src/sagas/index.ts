// * index.ts<sagas>

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

// *** TODO Refactor OrgData actions to typesafe actions

// * Imports

import { all, takeEvery, takeLatest } from 'redux-saga/effects';
import CaptureRedux from '../redux/CaptureRedux';
import NavigationRedux from '../redux/NavigationRedux';
import { OrgDataTypes } from '../redux/OrgDataRedux';
import SearchFilterRedux from '../redux/OrgSearcherFilterRedux';
import OrgSearcherRedux from '../redux/OrgSearcherRedux';
import StartupRedux from '../redux/StartupRedux';
import SyncRedux from '../redux/SyncRedux';
import CaptureSagas from './CaptureSagas';
import DialogSagas from './DialogSagas';
import LoadSagas from './LoadSagas';
import NavigateSagas from './NavigateSagas';
import NotebookSagas from './NotebookSagas';
import SearchSagas from './SearchSagas';
import SyncSagas from './SyncSagas';
import SystemSagas from './SystemSagas';
import NodeSagas from './NodeSagas';
import { getType } from 'typesafe-actions';

// * Code

export default function* root() {
  yield all([
    // some sagas only receive an action
    takeLatest(getType(StartupRedux.startup), SystemSagas.startup),

    /* ------------- data ------------- */
    takeLatest(OrgDataTypes.GET_ORG_DATA_REQUEST, LoadSagas.loadOrgData),
    takeLatest(OrgDataTypes.ADD_ORG_FILE_REQUEST, NotebookSagas.addOrgFile),
    takeLatest(OrgDataTypes.ADD_NOTEBOOK_REQUEST, NotebookSagas.addNotebook),
    takeLatest(OrgDataTypes.CLEAR_DB_REQUEST, SyncSagas.clearDb),
    takeLatest(OrgDataTypes.SYNC_ALL_FILES_REQUEST, SyncSagas.syncAllFiles),
    takeLatest(
      getType(SyncRedux.updateExternallyChangedFiles.request),
      SyncSagas.getExternallyChangedFiles,
    ),
    takeLatest(
      OrgDataTypes.SHOW_FILE_ACTIONS_DIALOG,
      DialogSagas.showFileActionsDialog,
    ),

    /* ------------- browser ------------- */
    takeLatest(
      OrgDataTypes.NAVIGATION_STACK_CHANGED,
      SystemSagas.manageBackHandlerFIXremoveBackHandlers,
    ),

    takeLatest(
      getType(NavigationRedux.loadBreadcrumbs),
      LoadSagas.loadBreadcrumbs,
    ),
    takeLatest(OrgDataTypes.VISIT_PLACE, SystemSagas.manageBackHandlerFIX),
    takeLatest(OrgDataTypes.OPEN_FILE_REQUEST, NavigateSagas.openOrgFile),
    takeLatest(OrgDataTypes.LOAD_RELATED_NODES, LoadSagas.loadRelatedNodes),
    takeLatest(OrgDataTypes.UPDATE_NODE, NodeSagas.updateNode),
    takeLatest(OrgDataTypes.LOAD_TOC, LoadSagas.loadTOC),
    takeLatest(OrgDataTypes.RUN_NODE_ACTION_REQUEST, NodeSagas.runNodeAction),
    takeLatest(OrgDataTypes.TOGGLE_MARK, NodeSagas.toggleMark),
    takeLatest(OrgDataTypes.LOAD_WEEK_AGENDA, LoadSagas.loadAgenda),
    takeLatest(OrgDataTypes.LOAD_DAY_AGENDA, LoadSagas.loadAgenda),

    /* ------------- capture ------------- */
    takeLatest(
      getType(CaptureRedux.visitCaptureTemplate),
      NavigateSagas.visitCaptureTemplate,
    ),
    takeLatest(
      getType(NavigationRedux.selectCaptureTemplateRequest),
      DialogSagas.selectCaptureTemplate,
    ),
    takeLatest(getType(CaptureRedux.confirm), CaptureSagas.confirmCapture),
    takeLatest(
      getType(CaptureRedux.addCaptureTemplate.request),
      CaptureSagas.addCaptureTemplate,
    ),
    takeEvery(getType(CaptureRedux.cancelCapture), CaptureSagas.cancelCapture),
    takeLatest(
      getType(CaptureRedux.showCaptureTemplateActions),
      DialogSagas.showCaptureTemplateActions,
    ),

    /* ------------- search ------------- */
    takeLatest(
      getType(OrgSearcherRedux.showSavedSearchesActions),
      DialogSagas.showSavedSearchesActions,
    ),
    takeLatest(getType(OrgSearcherRedux.search), SearchSagas.search),
    takeLatest(
      getType(SearchFilterRedux.saveSearchQuery.request),
      SearchSagas.saveSearch,
    ),
  ]);
}
