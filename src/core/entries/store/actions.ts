import { createStandardAction as action, createAsyncAction as asyncAction } from 'typesafe-actions'
import { PlainOrgNode } from 'org-mode-connection'

export type ApiResponse = {
  objects: { [entryId: string]: PlainOrgNode }
  orderingByFile: { [fileId: string]: string[] }
}

const preloadEntries = asyncAction(
  'entries/PRELOAD_ENTRIES_REQUEST',
  'entries/PRELOAD_ENTRIES_SUCCESS',
  'entries/PRELOAD_ENTRIES_FAILURE',
  'entries/PRELOAD_ENTRIES_CANCEL'
)<undefined, ApiResponse, Error, string>()

const loadEntries = asyncAction(
  'entries/LOAD_ENTRIES_REQUEST',
  'entries/LOAD_ENTRIES_SUCCESS',
  'entries/LOAD_ENTRIES_FAILURE',
  'entries/LOAD_ENTRIES_CANCEL'
)<{ fileId: string; entryId: string }, ApiResponse, Error, string>()

export default {
  loadEntries,
  preloadEntries,
}
