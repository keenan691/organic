import React, { useRef, useLayoutEffect, useEffect, useCallback, memo, useMemo } from 'react'
import { Text, FlatList, View, UIManager, LayoutAnimation } from 'react-native'

import { Separator, Empty } from 'elements'
import EntryListItem from './item'
import STRINGS from 'view/constants/strings'
import { OrgEntry } from 'core/entries/store/types'
import { Mode, State, EntryDict, Context, Refs } from './types'
import styles from './styles'
import CommandMenu from './elements/command-menu'
import reducer from './reducers'
import selectors from './selectors'
import { useMyReducer } from './hooks'
import actions from './actions'
import { safeGet } from 'helpers/functions'
import { focusItemAnimation, contentAnimation } from './animations'
import { useMeasure, useStateMonitor } from 'helpers/hooks'
import initialState from './state'
import { TapGestureHandler, RectButton } from 'react-native-gesture-handler'
import ReorderableTreeFlatList from 'components/reorderable-tree-flat-list'

type Props = {
  items: EntryDict
  onItemPress: (id: string) => void
  onItemLongPress: (id: string) => void
  visitedEntry?: OrgEntry
} & typeof defaultProps

const defaultProps = {
  mode: 'outline' as Mode,
  filters: {},
}

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true)

const EmptyComponent = () => (
  <Empty itemName={STRINGS.entry.namePlural} message={STRINGS.entry.emptyDescription} />
)

export const EntryListContext = React.createContext<Context>({
  dispatch: () => null,
})

const getItemLayout = (data, index) => {
  /* const length = this.cache[data[index].id]; */
  const length = 50
  /* const offset = this.offsets[index]; */
  const offset = 50 * index
  return {
    length,
    offset,
    index,
  }
}

const keyExtractor = item => item.id

function EntryList(props: Props) {
  const bench = useMeasure('EntryList')
  /**
   * State
   */
  // TODO może kopiowanie propsa data spowalnia wybieranie - sprawdzić jak to wpływa na wydajność
  // jeśli trzeba będzie to użyć immera i sprawdzić, datę można tez prznościć w metadanych akcji
  // mój dispatcher możeto automatycznie robić
  const [state, dispatch] = useMyReducer(
    reducer,
    initialState,
    (state: typeof initialState) => ({
      ...state,
      data: props.items,
      ordering: Object.keys(props.items).sort(key => props.items[key].position),
      mode: 'outline',
    })
  )

  /**
   * Selectors
   */
  const ordering = state.ordering
  const focusedEntry = selectors.getFocusedEntry(state)
  const focusedEntryId = safeGet('id', focusedEntry)
  /* const isEntryFocused = Boolean(focusedEntryId) */
  const isEntryFocused = false
  const isContentExpanded = false

  /* const isGlobalMenuVisible = !isEntryFocused */
  const isGlobalMenuVisible = false

  /**
   * Callbacks
   */
  const setOrdering = useCallback( (ordering) => {
    return dispatch(actions.setEntriesOrdering(ordering));
  },[])

  /**
   * Refs
   */
  const initialRefs: Refs = {
    entry: {
      commandMenuPosition: 'bottom',
      heights: {},
    },
    commands: {
      get: () => [],
      commandMenuOffsets: {},
      setMenuOffset: newOffset => console.tron.debug(newOffset),
    },
    dispatch,
  }

  const refs = useRef<Refs>(initialRefs)

  /**
   * Effects
   */
  useEffect(() => {
    // Update refs
    const lastFocusedEntry = selectors.getLastFocusedEntry(state)
    const lastFocusedEntryPosition = safeGet('position', lastFocusedEntry)
    const focusedEntryPosition = safeGet('position', focusedEntry)
    const commandMenuPosition = lastFocusedEntryPosition < focusedEntryPosition ? 'top' : 'bottom'

    refs.current.entry.commandMenuPosition = commandMenuPosition
  })

  useLayoutEffect(() => {
    LayoutAnimation.configureNext(focusItemAnimation())
  }, [focusedEntryId, ordering])

  useLayoutEffect(() => {
    LayoutAnimation.configureNext(contentAnimation(isContentExpanded))
  }, [state.contentVisibilityDict])

  /**
   * Dev
   */
  // XXX Dev starup actions and measurenment tools
  useEffect(() => {
    const entryKeys = Object.keys(props.items)
    dispatch(
      actions.onItemPress({
        entryId: props.items[entryKeys[2]].id,
      })
    )
  }, [])

  const beforeOutlineActivationCallback = useCallback(() => {
    /* dispatch(actions.blurItem()) */
  },[])

  useStateMonitor(state)
  bench.step('rendering starts')

  return (
    <EntryListContext.Provider value={refs}>
      <View style={styles.container}>
        <ReorderableTreeFlatList
          itemDict={props.items}
          ordering={ordering}
          setOrdering={setOrdering}
          ListHeaderComponent={<CommandMenu type="global" show={isGlobalMenuVisible} />}
          renderItem={(props) => (
            <EntryListItem
              {...props}
              showContent={state.contentVisibilityDict[props.item.id]}
              isFocused={state.isFocused && state.jumpList[0] === props.item.id}
            isFocused={false}
            />
          )}
          getItemLayout={getItemLayout}
          ItemSeparatorComponent={Separator}
          beforeOutlineActivation={beforeOutlineActivationCallback}
          keyExtractor={keyExtractor}
          ListEmptyComponent={EmptyComponent}
          initialNumToRender={30}
          maxToRenderPerBatch={30}
          windowSize={3}
          updateCellsBatchingPeriod={200}
        />
      </View>
    </EntryListContext.Provider>
  )
}

EntryList.defaultProps = defaultProps

export default EntryList
