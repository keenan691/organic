import React from 'react'
import { View, LayoutChangeEvent } from 'react-native'
import { TouchableHighlight } from 'react-native-gesture-handler'
import { hasHiddenChildren, hasChildren } from './visibility'
import { BooleanDict } from 'components/entry-list/types'
import ItemIndicator from './item-indicator'
import styles from './styles'

type Props = {
  hideDict: BooleanDict
  item: { id:  string }
  levels: number[]
  ordering: string[]
  onItemIndicatorPress: (itemPosition: number) => void
  onItemPress: (itemPosition: number) => void
  onItemLayoutCallback: (event: LayoutChangeEvent, itemId: string) => void
  position: number
  renderItem: (item:  object) => React.ReactElement
} & typeof defaultProps

const defaultProps = {}

function Item(props: Props) {
  const {
    hideDict,
    item,
    onItemIndicatorPress,
    onItemPress,
    ordering,
    onItemLayoutCallback,
    levels,
    position,
    renderItem,
  } = props
  if (hideDict[item.id]) return null
  return (
    <TouchableHighlight underlayColor="white" onPress={() => onItemPress(position)}>
      <View style={styles.item} onLayout={event => onItemLayoutCallback(event, item.id)}>
        <ItemIndicator
          level={levels[position]}
          hasHiddenChildren={hasHiddenChildren(position, hideDict, ordering, levels)}
          hasChildren={hasChildren(position, levels)}
          position={position}
          onPress={onItemIndicatorPress}
        />
        {renderItem({
          item,
          level: levels[position],
          position: position,
          defaultAction: onItemPress,
        })}
      </View>
    </TouchableHighlight>
  )
}

Item.defaultProps = defaultProps

export default Item
