import {createStandardAction as action, createAsyncAction as asyncAction} from 'typesafe-actions'
import {Source, Stat} from './types'

const addSource = asyncAction(
  'sources/ADD_SOURCE_REQUEST',
  'sources/ADD_SOURCE_SUCCESS',
  'sources/ADD_SOURCE_FAILURE',
  'sources/ADD_SOURCE_CANCEL',
)<
  {source: Source; stat: Stat; content: string},
  {id: string; metadata: string; description: string} & Source & Stat,
  Error,
  string
>()

// prettier-ignore
export default {
  addSource,
}
