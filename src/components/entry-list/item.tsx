import React, { memo, useContext } from 'react'
import { View, Text, TouchableHighlight } from 'react-native'

import { EntryHeadline, EntryContent } from 'elements'
import { OrgEntry } from 'core/entries/store/types'
import { EntryListContext } from '.'
import styles from './styles'
import actions from './actions'
import CommandMenu from './elements/command-menu'
import LevelIndicator from './elements/level-indicator'

type Props = {
  item: OrgEntry
} & typeof defaultProps

const defaultProps = {
  baseLevel: 1,
  showContent: false,
  isSelected: false,
  isFocused: false,
  highlighted: false,
  activateCallback: () => null,
  deactivateCallback: () => null,
  level: 0,
}

function EntryListItem(props: Props) {
  const {
    item,
    isFocused,
    showContent,
    highlighted,
    deactivateCallback,
    level
  } = props
  const id = item.id
  const { dispatch, entry } = useContext(EntryListContext).current

  return (
    <View
      style={[
        styles.container,
        { flexDirection: entry.commandMenuPosition === 'bottom' ? 'column' : 'column-reverse' },
      ]}
    >
      <View style={[styles.row, isFocused && styles.entryFocusedBg]}>
        <TouchableHighlight
          style={{ flex: 2 }}
          underlayColor="white"
          onLongPress={() => dispatch(actions.toggleContent({ entryId: id }))}
          onPress={() => {
            deactivateCallback()
            dispatch(actions.onItemPress({ entryId: id }))
          }}
        >
          <View style={[styles.column]}>
            <EntryHeadline colorized={true} highlighted={highlighted} {...item} level={level} />
            <EntryContent content={item.content} visible={showContent} />
          </View>
        </TouchableHighlight>
        <View>
          <Text>x</Text>
        </View>
      </View>
      <CommandMenu type="item" show={isFocused} level={item.level} />
    </View>
  )
}

EntryListItem.defaultProps = defaultProps

export default EntryListItem