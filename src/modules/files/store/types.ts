import { ActionType } from 'typesafe-actions'
import Creators from './actions'
import { PlainOrgFile } from 'org-mode-connection';

export type InitialState = {
  files: { [fileId:  string]: OrgFile},
  currentImportTaskDescription:  AssetsFileSource | null,
}

export type AssetsFileSource = {
  sourceType: 'assets'
  path: string
}

export type SourceTypes = AssetsFileSource['sourceType']

export type OrgFileMetadata = {
  TITLE?: string,
}

export type OrgFile = Omit<PlainOrgFile, 'metadata'> & {
  metadata: OrgFileMetadata
}
