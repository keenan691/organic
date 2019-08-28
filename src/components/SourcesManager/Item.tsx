import React from 'react'
import { View, LayoutChangeEvent, Text } from 'react-native'
import { TouchableHighlight } from 'react-native-gesture-handler'
import { BooleanDict } from 'components/editor/types'
import styles from './styles'
import OrgContent from 'elements/entry-content';
import { Colors } from 'themes/colors';

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
}

function Item(props: Props) {
  const {
    hideDict,
    item,
    levels,
    onItemLayoutCallback,
    onItemPress,
    position,
  } = props

  const level = levels[position]

  if (hideDict[item.id]) return null
  return (
    <TouchableHighlight
      underlayColor={Colors.white}
      onPress={() => {
        onItemPress({...item, position})
      }}
    >
      <View
        style={[styles.column ]}
        onLayout={event => onItemLayoutCallback(event, item.id)}
      >
        <Text style={styles[`h${level}R`]}>{item.headline}</Text>
        <OrgContent content={item.content} visible/>
      </View>
    </TouchableHighlight>
  )
}

export default Item
