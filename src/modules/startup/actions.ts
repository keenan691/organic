import { createStandardAction as action, createAsyncAction as asyncAction } from 'typesafe-actions'

const startup = asyncAction(
  'startup/STARTUP_REQUEST',
  'startup/STARTUP_SUCCESS',
  'startup/STARTUP_FAILURE',
)<undefined, undefined, Error>();

export default {
  startup,
}
