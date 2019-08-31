import { createStandardAction as action, createAsyncAction as asyncAction } from 'typesafe-actions'
import { Source, Stat } from './types';

const addSource = action('sources/ADD_SOURCE')<{ source: Source, stat: Stat, content: string}>()

// prettier-ignore
export default {
  addSource,
}
