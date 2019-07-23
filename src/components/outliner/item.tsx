import React, { useCallback } from 'react'
import { View, LayoutChangeEvent } from 'react-native'
import { TouchableHighlight } from 'react-native-gesture-handler'
import { hasHiddenChildren, hasChildren } from './visibility'
import { BooleanDict } from 'components/entry-list/types'
import ItemIndicator from './item-indicator'
import styles from './styles'
import { Colors } from 'view/themes'
import { ITEM_PADDING_VERTICAL, HEADLINE_FONT_SIZE } from './constants';
import { EntryHeadline } from 'elements';

type Props = {
  hideDict: BooleanDict
  item: { id: string; content: string }
  levels: number[]
  ordering: string[]
  itemHeight?:  number
  onItemIndicatorPress: (itemPosition: number) => void
  onItemPress: (itemPosition: number) => void
  onItemLayoutCallback: (event: LayoutChangeEvent, itemId: string) => void
  position: number
  renderItem: (item: object) => React.ReactElement
} & typeof defaultProps

const defaultProps = {}

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
    renderItem,
  } = props
  if (hideDict[item.id]) return null
  const level = levels[position]
  return (
    <TouchableHighlight underlayColor={Colors.white} onPress={() => onItemPress(position)}>
      <View style={[styles.item, itemHeight && { height:  itemHeight }]}
        onLayout={event => onItemLayoutCallback(event, item.id)}>
        <ItemIndicator
          level={levels[position]}
          hasHiddenChildren={hasHiddenChildren(position, hideDict, ordering, levels)}
          hasChildren={hasChildren(position, levels)}
          hasContent={Boolean(item.content)}
          position={position}
          onPress={onItemIndicatorPress}
        />
        <EntryHeadline
          colorized={true}
          {...item}
          level={level}
          position={position}
          fontSize={HEADLINE_FONT_SIZE}
        />
      </View>
    </TouchableHighlight>
  )
}

Item.defaultProps = defaultProps

export default Item
