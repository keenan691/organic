import { createStandardAction as action, createAsyncAction as asyncAction } from 'typesafe-actions'
import { PlainOrgNode } from 'org-mode-connection'
import { EntryPoint } from './types';

export type ApiResponse = {
  objects: { [entryId: string]: PlainOrgNode }
  orderingByFile: { [fileId: string]: string[] }
}

const mergeSearchEntries = action('entries/MERGE_SEARCH_ENTRIES')<any>()
const mergeEditorEntries = action('entries/MERGE_EDITOR_ENTRIES')<PlainOrgNode[]>()
const mergeAgendaEntries = action('entries/MERGE_AGENDA_ENTRIES')<any>()

const loadEntriesForEntryPoint = asyncAction(
  'entries/LOAD_ENTRIES_FOR_ENTRY_POINT_REQUEST',
  'entries/LOAD_ENTRIES_FOR_ENTRY_POINT_SUCCESS',
  'entries/LOAD_ENTRIES_FOR_ENTRY_POINT_FAILURE',
  'entries/LOAD_ENTRIES_FOR_ENTRY_POINT_CANCEL'
)<EntryPoint, any[], Error, string>();

export default {
  loadEntriesForEntryPoint,
  mergeAgendaEntries,
  mergeEditorEntries,
  mergeSearchEntries,
}
