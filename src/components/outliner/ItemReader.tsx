import React, { useCallback, memo } from 'react'
import { View, LayoutChangeEvent, LayoutAnimation, Text } from 'react-native'
import { TouchableHighlight } from 'react-native-gesture-handler'
import { BooleanDict } from 'components/entry-list/types'
import ItemIndicator from './ItemIndicator'
import styles from './styles'
import { Colors } from 'view/themes'
import { ITEM_PADDING_VERTICAL, HEADLINE_FONT_SIZE } from './constants'
import { EntryHeadline } from 'elements'
import { hasChildren, hasHiddenChildren } from './useVisibility'
import { foldAnimation } from './animations'
import OrgContent from 'elements/entry-content';

type Props = {
  hideDict: BooleanDict
  item: { id: string; content: string }
  levels: number[]
  ordering: string[]
  itemHeight?: number
  onItemIndicatorPress: (itemPosition: number) => void
  onItemPress: (itemPosition: number) => void
  onItemLayoutCallback: (event: LayoutChangeEvent, itemId: string) => void
  position: number
} & typeof defaultProps

const defaultProps = {
  type: 'headline' as 'headline' | 'project' | 'habit' | 'task',
}

function ItemReader(props: Props) {
  const {
    hideDict,
    item,
    onItemIndicatorPress,
    onItemPress,
    ordering,
    itemHeight,
    onItemLayoutCallback,
    levels,
    position,
  } = props

  if (hideDict[item.id]) return null

  const level = levels[position]

  const textStyles = [styles[`h${level}R`]]
  return (
    <TouchableHighlight
      underlayColor={Colors.white}
      onPress={() => {
        onItemPress(position)
      }}
    >
      <View
        style={[styles.column ]}
        onLayout={event => onItemLayoutCallback(event, item.id)}
      >
        <Text style={textStyles}>{item.headline}</Text>
        <OrgContent content={item.content} visible/>
      </View>
    </TouchableHighlight>
  )
}

ItemReader.defaultProps = defaultProps

export default ItemReader
