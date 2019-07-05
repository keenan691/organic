import { createSelector } from 'reselect'

import { OrgEntry } from 'core/entries/store/types'
import { State, NumberDict } from './types'

const getLastFocusedEntryId = (state: State) =>  state.jumpList[0]

const getEntriesOrdering = createSelector(
  (state: State) => state.itemsDict,
  data => Object.keys(data).sort(key => data[key].position)
)

const getEntries = createSelector(
  getEntriesOrdering,
  (state: State) => state.itemsDict,
  (ordering, data) => ordering.map(id => data[id])
)

const getEntryPositionDict = createSelector(
  getEntries,
  (entries): NumberDict =>
    entries.reduce(
      (acc, { id }, idx) => ({
        ...acc,
        [id]: idx,
      }),
      {}
    )
)

const getFocusedEntry = ({ itemsDict, jumpList, isFocused }: State): OrgEntry | null =>
  (!isFocused || jumpList.length < 2) ? null : itemsDict[jumpList[0]]

const getLastFocusedEntry = (state: State): OrgEntry | null => {
  const jumpList = state.jumpList
  if (jumpList.length < 2) return null
  return state.itemsDict[jumpList[1]]
}

const getActionMenuPosition = createSelector(
  getEntryPositionDict,
  getFocusedEntry,
  getLastFocusedEntry,
  (positions, focusedEntry, previouslyFocusedEntry): 'top' | 'bottom' | undefined => {
    if (!focusedEntry || !previouslyFocusedEntry) return
    return positions[focusedEntry.id] < positions[previouslyFocusedEntry.id] ? 'top' : 'bottom'
  }
)

const selectors = {
  getActionMenuPosition,
  getEntries,
  getEntriesOrdering,
  getEntryPositionDict,
  getFocusedEntry,
  getLastFocusedEntryId,
  getLastFocusedEntry,
}

export default selectors
