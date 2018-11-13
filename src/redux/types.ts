// * types.ts

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

import { PlainOrgFile, PlainOrgNode, PlainOrgTimestampShort, TimeRange } from 'org-mode-connection';
import SeamlessImmutable from 'seamless-immutable';

// ** Global State

export interface GlobalState {
  agenda: AgendaInitialState;
  capture: CaptureInitialState;
  data: DataInitialState;
  form: object;
  navigation: NavigationInitialState;
  search: SearchInitialState;
  searchFilter: SearchFilterInitialState;
  settings: SettingsInitialState;
  startup: StartupInitialState;
  sync: SyncInitialState;
}

// ** Slices

// *** Agenda

export type AgendaInitialState = SeamlessImmutable.Immutable<{
  selectedDay?: string | null;
}>;

// *** Capture

export type CaptureTemplate = {
  name?: string;
  type: 'regular';
  target: {
    fileId?: string;
    nodeId?: string;
    headline?: string;
  };
  todo?: string;
  priority?: string;
  headline: string;
  tags: string[];
  content: string;
  timestamps: object[];
};

export type CaptureInitialState = SeamlessImmutable.Immutable<{
  captureTemplates: { [name: string]: CaptureTemplate };
}>;

// *** Data

export type DataStack =
  | 'agenda'
  | 'agendaResults'
  | 'lastCaptured'
  | 'markedPlaces'
  | 'notes'
  | 'search'
  | 'searchResults';

export type NavStack = { [navStackId: string]: string[] };
export type NodesIds = string[];
export type NodesDict = { [nodeId: string]: PlainOrgNode };
export type FilesDict = { [fileId: string]: PlainOrgFile };
export type DataInitialState = SeamlessImmutable.Immutable<{
  dayTimestamps: PlainOrgTimestampShort[];
  files: FilesDict;
  isDataLoaded: { [K in DataStack]: boolean };
  lastCapturedNodes: string[];
  loadedNodesIds: { [K in DataStack]: string };
  navigationStackHistory: DataStack[];
  nodes: NodesDict;
  tags: string[];
  timestamps: PlainOrgTimestampShort[];
  timestampsRange: TimeRange;
  tocIds: { [K in DataStack]: string[] };
  visitedFileId: { [K in DataStack]: string };
  visitedNodeId: { [K in DataStack]: string };
}>;
// *** Form

export type FormInitialState = SeamlessImmutable.Immutable<{}>;

// *** Navigation

export type CaptureRoute = { key: string; label: string; icon: string };
export type NavigationInitialState = SeamlessImmutable.Immutable<{
  breadcrumbs: object[]; // selectCaptureTemplate node ancestors
  captureNavigationState: {
    index: number;
    routes: [CaptureRoute, CaptureRoute, CaptureRoute];
  };
  captureType: 'capture' | 'addHeadline' | 'edit';
  isModalVisible: boolean;
  navigationStackHistory: object[];
  selectedCaptureTemplate: string | null;
  visibleScreenId: string | null;
}>;

// *** Search

export type SearchInitialState = SeamlessImmutable.Immutable<{}>;

// *** Search Filter

type FilterValues = -1 | 0 | 1;
export type SearchQuery = {
  name: string | null;
  todos: { [todo: string]: FilterValues };
  tags: { [todo: string]: FilterValues };
  priority: {
    A: FilterValues;
    B: FilterValues;
    C: FilterValues;
  };
  isScheduled: boolean;
  hasDeadline: boolean;
  searchTerm: string;
};

export type SavedSearchFilter = { name: string };

export type SearchFilterInitialState = SeamlessImmutable.Immutable<{
  query: SearchQuery;
  savedItems: SavedSearchFilter[];
  visibilityFilter: {
    narrowToFile: undefined;
    sorting: undefined;
  };
}>;

// *** Settings

export type SettingsInitialState = SeamlessImmutable.Immutable<{
  unfinishedTaskStates: string[];
  finishedTaskStates: string[];
  priorities: string[];
  pinnedTag: string;
  theme: string;
  tags: string[];
}>;

// *** Startup

export type StartupInitialState = SeamlessImmutable.Immutable<{
  firstRun: boolean;
  privacyPolicyAgreed: boolean;
}>;

// *** Sync

export type SyncInitialState = SeamlessImmutable.Immutable<{
  externallyChangedFiles: { [index: string]: string[] };
  changedFiles: { [index: string]: string[] };
}>;
