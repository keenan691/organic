import React, { memo, useContext } from 'react'
import { View, Text} from 'react-native'

import { EntryHeadline, EntryContent } from 'elements'
import { OrgEntry } from 'core/entries/store/types'
import { EntryListContext } from '.'
import styles from './styles'
import CommandMenu from './elements/command-menu'
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Colors } from 'view/themes';

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
          editable={false}
          highlighted={highlighted}
          {...item}
          level={level}
        />
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
          <View style={[styles.column]}>
            <TouchableHighlight
              onPress={() => {
                defaultAction && defaultAction(position)
              }}
              disabled={props.editable}
            >
            <EntryHeadline
              colorized={true}
              editable={editable}
              highlighted={highlighted}
              {...item}
              level={level}
            />
            </TouchableHighlight>
          </View>
      </View>
    </View>
  )
}

EntryListItem.defaultProps = defaultProps

export default EntryListItem
