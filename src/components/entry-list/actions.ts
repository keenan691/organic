import { createStandardAction as action, createAsyncAction as asyncAction } from 'typesafe-actions'
import { Perspective, Item, Route } from './types'
import { Dispatch } from 'redux';

// TODO export every action separatelly and then import all
const setEntriesOrdering = action('entry-list/SET_ENTRIES_ORDERING')<string[]>()
const setEntriesLevels = action('entry-list/SET_ENTRIES_LEVELS')<any>()
const addItem = action('entry-list/ADD_ITEM')<any>()
const deleteItems = action('entry-list/DELETE_ITEMS')<number[]>()
const changeItems = action('entry-list/CHANGE_ITEMS')<any>()

const focusItem = action('entry-list/FOCUS_ITEM')<{ entryId: string }>()
const repeatLastAction = action('entry-list/REPEAT_LAST_ACTION')()
const scheduleNextUpdate = action('entry-list/SCHEDULE_NEXT_UPDATE')()
const addActionToQueue = action('entry-list/ADD_ACTION_TO_QUEUE')()
const openItem = action('entry-list/OPEN_ITEM')<any>()
const onIndexChange = action('entry-list/ON_INDEX_CHANGE')<any>()
const activateNextRoute = action('entry-list/ACTIVATE_NEXT_ROUTE')()
const onFocusedItemChange = action('entry-list/ON_FOCUSED_ITEM_CHANGE')<{ route: Route, position: number, item: Item}>()

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
