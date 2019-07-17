import React, { memo, useContext } from 'react'
import { View, Text} from 'react-native'

import { EntryHeadline, EntryContent } from 'elements'
import { OrgEntry } from 'core/entries/store/types'
import { EntryListContext } from '.'
import styles from './styles'
import actions from './actions'
import CommandMenu from './elements/command-menu'
import LevelIndicator from './elements/level-indicator'
import { TouchableHighlight } from 'react-native-gesture-handler';

type Props = {
  item: OrgEntry
} & typeof defaultProps

const defaultProps = {
  baseLevel: 1,
  showContent: false,
  isSelected: false,
  isFocused: false,
  highlighted: false,
  editable: false,
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
    editable,
    deactivateCallback,
    defaultAction,
    position,
    level,
  } = props
  const id = item.id
  const { dispatch, entry } = useContext(EntryListContext).current

  return (
    <View style={[styles.column]}>
      <EntryHeadline
        colorized={true}
        editable={editable}
        highlighted={highlighted}
        {...item}
        level={level}
      />
      <EntryContent content={item.content} visible={showContent} />
    </View>
  )
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
          onPress={() => {
            defaultAction && defaultAction(position)
          }}
          disabled={props.editable}
        >
          <View style={[styles.column]}>
            <EntryHeadline
              colorized={true}
              editable={editable}
              highlighted={highlighted}
              {...item}
              level={level}
            />
            <EntryContent content={item.content} visible={showContent} />
          </View>
        </TouchableHighlight>
      </View>
      <CommandMenu type="item" show={isFocused} level={item.level} />
    </View>
  )
}

EntryListItem.defaultProps = defaultProps

export default EntryListItem
