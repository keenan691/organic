import { createStandardAction as action, createAsyncAction as asyncAction } from 'typesafe-actions'
import { PlainOrgFile } from 'org-mode-connection'
import { AssetsFileSource } from './types';

const createFileFromSource = asyncAction(
  'files/CREATE_FILE_FROM_SOURCE_REQUEST',
  'files/CREATE_FILE_FROM_SOURCE_SUCCESS',
  'files/CREATE_FILE_FROM_SOURCE_FAILURE',
  'files/CREATE_FILE_FROM_SOURCE_CANCEL'
)<AssetsFileSource, PlainOrgFile, Error, string>()

// prettier-ignore
export default {
  createFileFromSource,
}
