import React, { useRef, useLayoutEffect, useEffect, useCallback } from 'react'
import { View, LayoutAnimation, Dimensions, Text } from 'react-native'
import { TabView, TabBar } from 'react-native-tab-view'

import { Separator, Empty } from 'elements'
import STRINGS from 'view/constants/strings'
import { Perspective, EntryDict } from './types'
import styles from './styles'
import actions from './actions'
import { focusItemAnimation } from './animations'
import { useMeasure, useStateMonitor } from 'helpers/hooks'
import Outliner from 'components/outliner'
import { useUnifiedLists } from './useUnifiedLists'
import { UnifiedListsHOC } from './UnifiedListsHOC'
import { useData } from './useData'
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'
import { itemKeyExtractor } from 'helpers/functions'
import CircularMenu from 'experiments/circular-menu';
import BatchEditActions from 'experiments/batch-edit-actions';

export type Props = {
  entries: EntryDict
} & typeof defaultProps

const defaultProps = {
  mode: 'sdf',
  perspective: 'outline' as Perspective,
}

function EntryList(props: Props) {
  const tabsRef = useRef({})

  const { unifiedListsApiRef, activeRoute, navigationState } = useUnifiedLists(tabsRef)

  const [entriesState, useEntriesAction, entryActions, entryDispatch] = useData(
    props.entries,
    unifiedListsApiRef
  )
  const entriesProps = {
    itemDict: entriesState.itemsDict,
    levels: entriesState.levels,
    ordering: entriesState.ordering,
    addItem: useEntriesAction(actions.addItem),
    changeItems: useEntriesAction(actions.changeItems),
    deleteItems: useEntriesAction(actions.deleteItems),
    setLevels: useEntriesAction(actions.setEntriesLevels),
    setOrdering: useEntriesAction(actions.setEntriesOrdering),
  }

  const [workspacesState, useWorkspacesAction, workspaceActions, workspaceDispatch] = useData(
    props.workspaces,
    unifiedListsApiRef
  )

  const workspacesProps = {
    itemDict: workspacesState.itemsDict,
    levels: workspacesState.levels,
    ordering: workspacesState.ordering,
    addItem: useWorkspacesAction(actions.addItem),
    changeItems: useWorkspacesAction(actions.changeItems),
    deleteItems: useWorkspacesAction(actions.deleteItems),
    setLevels: useWorkspacesAction(actions.setEntriesLevels),
    setOrdering: useWorkspacesAction(actions.setEntriesOrdering),
    openHandler: useWorkspacesAction(actions.openItem, (item: Item) => {
      /* if (item.type === 'workspace')
       *   unifiedListsApiRef.current.dispatch(actions.activateNextRoute()) */
    }),
  }

  const onIndexChangeCallback = useCallback(
    index => unifiedListsApiRef.current.dispatch(actions.onIndexChange(index)),
    []
  )

  return (
    <View style={styles.container}>
      <TabView
        navigationState={navigationState}
        swipeEnabled={true}
        lazy={true}
        renderLazyPlaceholder={() => <Text>preload</Text>}
        tabBarPosition="top"
        renderTabBar={props => <TabBar style={styles.modeline} {...props} />}
        onIndexChange={onIndexChangeCallback}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderScene={({ route, position }) => {
          const controlProps = {
            isActiveRoute: route.key === activeRoute.key,
            unifiedListsApiRef,
            route,
            position,
          }

          switch (route.key) {
            case 'workspace':
              return (
                <View style={[styles.scene]}>
                  <ControlledOutliner
                    {...workspacesProps}
                    {...controlProps}
                    canAddItems={false}
                    ItemSeparatorComponent={Separator}
                    keyExtractor={itemKeyExtractor}
                    ListEmptyComponent={EmptyList}
                    initialNumToRender={30}
                    maxToRenderPerBatch={30}
                    windowSize={3}
                    updateCellsBatchingPeriod={200}
                    mode="outliner"
                  />
                </View>
              )
            case 'outliner':
              return (
                <View style={[styles.scene]}>
                  <ControlledOutliner
                    {...entriesProps}
                    {...controlProps}
                    canAddItems={true}
                    ItemSeparatorComponent={Separator}
                    keyExtractor={itemKeyExtractor}
                    ListEmptyComponent={EmptyList}
                    initialNumToRender={30}
                    maxToRenderPerBatch={30}
                    windowSize={3}
                    updateCellsBatchingPeriod={200}
                    mode="outliner"
                  />
                </View>
              )
            case 'visitor':
              return (
                <View style={[styles.scene]}>
                  <ControlledOutliner
                    {...entriesProps}
                    {...controlProps}
                    ItemSeparatorComponent={Separator}
                    keyExtractor={itemKeyExtractor}
                    ListEmptyComponent={EmptyList}
                    initialNumToRender={30}
                    maxToRenderPerBatch={30}
                    windowSize={3}
                    updateCellsBatchingPeriod={200}
                    mode="reader"
                  />
                </View>
              )
          }
        }}
      />
    </View>
  )
}

EntryList.defaultProps = defaultProps

const EmptyList = (
  <Empty itemName={STRINGS.entry.namePlural} message={STRINGS.entry.emptyDescription} />
)

const ControlledOutliner = UnifiedListsHOC(Outliner)

export default gestureHandlerRootHOC(EntryList)
