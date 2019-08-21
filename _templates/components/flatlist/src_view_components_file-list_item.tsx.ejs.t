---
to: src/components/<%= h.changeCase.pascal(name) %>/Item.tsx
---
import React from 'react'
import { Text, TouchableOpacity } from 'react-native'

import styles from './styles'

type Props = {
  item: object
  onPress: () => void
  onLongPress: () => void
}

export default function Item({ item, onPress, onLongPress }: Props) {
  return (
    <TouchableOpacity style={[styles.item]} onPress={onPress} onLongPress={onLongPress}>
      <Text style={styles.itemTitle}><%= name %> with id: {item.id}</Text>
    </TouchableOpacity>
  )
}
