import React, { useCallback, memo } from 'react'
import { View, LayoutChangeEvent, Text} from 'react-native'
import { TouchableHighlight } from 'react-native-gesture-handler'
import ItemIndicator from './ItemIndicator'
import styles from './styles'
import { Colors } from 'themes'
import { ITEM_PADDING_VERTICAL, HEADLINE_FONT_SIZE } from './constants'
import { EntryHeadline } from 'elements'

type Props = {
  item: { id: string; content: string }
  type:  string,
  headline:  string,
  itemHeight?: number
  onItemIndicatorPress: (itemPosition: number) => void
  onItemPress: (itemPosition: number) => void
  onItemLayoutCallback: (event: LayoutChangeEvent, itemId: string) => void
  position: number,
  hasChildren: boolean,
  hasContent: boolean,
  hasHiddenChildren: boolean,
  level:  number,
  isHidden: boolean,
  id:  string
}

function Item(props: Props) {
  const {
    headline,
    onItemIndicatorPress,
    onItemPress,
    itemHeight,
    onItemLayoutCallback,
    position,
    hasChildren,
    hasContent,
    hasHiddenChildren,
    level,
    type,
    isHidden,
    id
  } = props

  if (isHidden) return null

  return (
    <TouchableHighlight
      underlayColor={Colors.white}
      onPress={() => {onItemPress(position)}}
    >
      <View
        style={[styles.item, itemHeight && { height: itemHeight }]}
        onLayout={event => onItemLayoutCallback(event, id)}
      >
        <ItemIndicator
          position={position}
          level={level}
          type={type}
          hasHiddenChildren={hasHiddenChildren}
          hasChildren={hasChildren}
          onPress={onItemIndicatorPress}
        />
        <EntryHeadline
          type={type}
          headline={headline}
          level={level}
          position={position}
        />
      </View>
    </TouchableHighlight>
  )
}

export default Item
