// * types.ts<OrgDataRedux>

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

// *** TODO type
// *** TODO refactor to switch case

// ** Code

import SeamlessImmutable from 'seamless-immutable';
import { ActionType } from 'typesafe-actions';
import * as DataActions from './Actions';

// FIXME types are moved to redux/types.ts. Fix all import on this reducer

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

export interface Node {
  fileId: string;
}

export type DataAction = ActionType<typeof DataActions>;
export type NodesDict = { [nodeId: string]: Node };
export type InitialState = SeamlessImmutable.Immutable<{
  agendaRange: object;
  dayTimestamps: object[];
  files: object;
  isBusy: boolean;
  isDataLoaded: object;
  lastAddedNode: null;
  lastCapturedNodes: string[];
  loadedNodesIds: NavStack;
  navigationStackHistory: string[];
  nodes: NodesDict;
  tags: string[];
  timestamps: object[];
  timestampsRange: object;
  tocIds: object;
  visitedFileId: string[];
  visitedNodeId: string[];
}>;
