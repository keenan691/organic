import {TabView} from 'react-native-tab-view'
import {View, Dimensions, Text} from 'react-native'
import React, {useRef, useCallback} from 'react'

import ContentReader from 'components/reader'
import Outliner from 'components/outliner'
import Workspaces from 'components/workspaces'

import {EntryDict} from './types'
import {UnifiedListsHOC} from './UnifiedListsHOC'
import {useItems} from './useItems'
import {useUnifiedLists} from './useUnifiedLists'
import actions from './actions'
import styles from './styles'

export type Props = {
  entries: EntryDict
  workspaces: EntryDict
}

const ControlledOutliner = UnifiedListsHOC(Outliner)
const ControlledContentReader = UnifiedListsHOC(ContentReader)
const ControlledWorkspaces = UnifiedListsHOC(Workspaces)

const createOutlinerProps = (state, useAction) => ({
  itemDict: state.itemDict,
  levels: state.levels,
  ordering: state.ordering,
  addItem: useAction(actions.addItem),
  changeItems: useAction(actions.changeItems),
  deleteItems: useAction(actions.deleteItems),
  setLevels: useAction(actions.setEntriesLevels),
  setOrdering: useAction(actions.setEntriesOrdering),
})

function Editor(props: Props) {
  const tabsRef = useRef({})

  const {unifiedListsApiRef, activeRoute, navigationState} = useUnifiedLists(tabsRef)

  const [entriesState, useEntriesAction] = useItems(props.entries, unifiedListsApiRef)
  const entriesProps = createOutlinerProps(entriesState, useEntriesAction)

  const [workspacesState, useWorkspacesAction] = useItems(props.workspaces, unifiedListsApiRef)
  const workspacesProps = createOutlinerProps(workspacesState, useWorkspacesAction)

  const openHandler = useCallback(({id, type}) => {
    unifiedListsApiRef.current.dispatch(actions.activateNextRoute())
    if (type==='file'){

    }
  } ,[])

  return (
    <View style={styles.container}>
      <TabView
        renderScene={({route, position}) => {
          const controlProps = {
            isActiveRoute: route.key === activeRoute.key,
            unifiedListsApiRef,
            route,
            position,
            openHandler
          }
          return (
            <View style={[styles.scene]}>
              {
                {
                  workspace: <ControlledWorkspaces {...workspacesProps} {...controlProps} />,
                  outliner: <ControlledOutliner {...entriesProps} {...controlProps} />,
                  visitor: <ControlledContentReader {...entriesProps} {...controlProps} />,
                }[route.key]
              }
            </View>
          )
        }}
        onIndexChange={useCallback(
          index => unifiedListsApiRef.current.dispatch(actions.onIndexChange(index)),
          [],
        )}
        navigationState={navigationState}
        swipeEnabled={true}
        renderLazyPlaceholder={() => <Text>preload</Text>}
        tabBarPosition="top"
        initialLayout={{width: Dimensions.get('window').width}}
      />
    </View>
  )
}

export default Editor
