---
to: src/view/components/<%= h.changeCase.param(name) %>/Item.tsx
---
import React from 'react'
import { Text, TouchableOpacity } from 'react-native'

import styles from './styles'

type Props = {
  item: object
  onPress: () => void
  onLongPress: () => void
}

function FileListItem({ item, onPress, onLongPress }: Props) {
  return (
    <TouchableOpacity style={[styles.item]} onPress={onPress} onLongPress={onLongPress}>
      <Text style={styles.itemTitle}><%= name %> with id: {item.id}</Text>
    </TouchableOpacity>
  )
}

export default FileListItem
