import { createStandardAction as action, createAsyncAction as asyncAction } from 'typesafe-actions'
import { Perspective, Item, Route } from './types'
import { Dispatch } from 'redux';

// TODO export every action separatelly and then import all
const setEntriesOrdering = action('editor/SET_ENTRIES_ORDERING')<string[]>()
const setEntriesLevels = action('editor/SET_ENTRIES_LEVELS')<any>()
const addItem = action('editor/ADD_ITEM')<any>()
const deleteItems = action('editor/DELETE_ITEMS')<number[]>()
const changeItems = action('editor/CHANGE_ITEMS')<any>()

const focusItem = action('editor/FOCUS_ITEM')<{ entryId: string }>()
const repeatLastAction = action('editor/REPEAT_LAST_ACTION')()
const scheduleNextUpdate = action('editor/SCHEDULE_NEXT_UPDATE')()
const addActionToQueue = action('editor/ADD_ACTION_TO_QUEUE')()
const openItem = action('editor/OPEN_ITEM')<any>()
const onIndexChange = action('editor/ON_INDEX_CHANGE')<any>()
const activateNextRoute = action('editor/ACTIVATE_NEXT_ROUTE')()
const onFocusedItemChange = action('editor/ON_FOCUSED_ITEM_CHANGE')<{ route: Route, position: number, item: Item}>()

export default {
  onFocusedItemChange,
  activateNextRoute,
  onIndexChange,
  openItem,
  addActionToQueue,
  scheduleNextUpdate,
  focusItem,
  changeItems,
  deleteItems,
  addItem,
  setEntriesLevels,
  setEntriesOrdering,
  repeatLastAction,
}
