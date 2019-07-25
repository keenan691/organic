import React, { memo } from 'react'
import { Text, TouchableOpacity } from 'react-native'
import styles from './styles'

type EmptyProps = {
  itemName: string
  message: string
}

function Empty({ itemName, message }: EmptyProps) {
  return (
    <TouchableOpacity style={styles.container}>
      <Text style={styles.header}>You have no {itemName}</Text>
      <Text style={styles.content}>{message}</Text>
    </TouchableOpacity>
  )
}

export default memo(Empty)
