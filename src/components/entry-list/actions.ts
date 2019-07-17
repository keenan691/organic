import { createStandardAction as action, createAsyncAction as asyncAction } from 'typesafe-actions'
import { Mode } from './types'
import { Dispatch } from 'redux';

// TODO export every action separatelly and then import all
const blurItem = action('entry-list/BLUR_ITEM')<{ entryId: string }>()
const focusItem = action('entry-list/FOCUS_ITEM')<{ entryId: string }>()
const onItemPress = action('entry-list/ON_ITEM_PRESS')<{ entryId: string }>()
const repeatLastAction = action('entry-list/REPEAT_LAST_ACTION')()
const runCommand = action('entry-list/RUN_COMMAND')<string>()
const setMode = action('entry-list/SET_MODE')<{ mode: Mode }>()
const toggleContent = action('entry-list/TOGGLE_CONTENT')<{ entryId: string }>()
const toggleFocus = action('entry-list/TOGGLE_FOCUS')<{ entryId: string }>()
const jump = action('entry-list/JUMP')<{ entryId: string }>()
const setEntriesOrdering = action('entry-list/SET_ENTRIES_ORDERING')<string[]>()
const setEntriesLevels = action('entry-list/SET_ENTRIES_LEVELS')<any>()
const addItem = action('entry-list/ADD_ITEM')<any>()

export default {
  addItem,
  setEntriesLevels,
  setEntriesOrdering,
  jump,
  toggleFocus,
  blurItem,
  focusItem,
  onItemPress,
  repeatLastAction,
  runCommand,
  setMode,
  toggleContent,
}
