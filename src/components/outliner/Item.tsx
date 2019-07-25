import React, { useCallback, memo } from 'react'
import { View, LayoutChangeEvent, LayoutAnimation } from 'react-native'
import { TouchableHighlight } from 'react-native-gesture-handler'
import { BooleanDict } from 'components/entry-list/types'
import ItemIndicator from './ItemIndicator'
import styles from './styles'
import { Colors } from 'view/themes'
import { ITEM_PADDING_VERTICAL, HEADLINE_FONT_SIZE } from './constants'
import { EntryHeadline } from 'elements'
import { hasChildren, hasHiddenChildren } from './useVisibility'
import { foldAnimation } from './animations'
import { levelColors } from 'view/themes/org-colors';

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
}

function Item(props: Props) {
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

  return (
    <TouchableHighlight
      underlayColor={Colors.white}
      onPress={() => {
        onItemPress({...item, position})
      }}
    >
      <View
        style={[styles.item, itemHeight && { height: itemHeight }]}
        onLayout={event => onItemLayoutCallback(event, item.id)}
      >
        <ItemIndicator
          position={position}
          level={levels[position]}
          type={item.type}
          hasHiddenChildren={hasHiddenChildren(position, hideDict, ordering, levels)}
          hasChildren={hasChildren(position, levels)}
          hasContent={Boolean(item.content)}
          onPress={onItemIndicatorPress}
        />
        <EntryHeadline
          type={item.type}
          headline={item.headline}
          level={level}
          position={position}
        />
      </View>
    </TouchableHighlight>
  )
}

Item.defaultProps = defaultProps

export default Item
