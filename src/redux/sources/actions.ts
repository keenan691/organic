import { createStandardAction as action, createAsyncAction as asyncAction } from 'typesafe-actions'

const addSource = action('sources/ADD_SOURCE')<any>()
// prettier-ignore
export default {
  addSource,
}
