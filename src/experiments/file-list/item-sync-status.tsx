import React from 'react'
import { Text, View } from 'react-native'
import FontAwesome, { Icons } from 'react-native-fontawesome'

import styles from './styles'

type Props = {
  message: {
    type: 'info' | 'warning' | 'error'
    text: string
  }
}

function FileListItemSyncStatus({ message: { type, text } }: Props) {
  return (
    <View style={styles.fileStatus}>
      <View style={[styles.label]} key={type}>
        <Text style={[styles.labelText, styles[`${type}Message`]]}>
          <FontAwesome>{Icons.syncAlt}</FontAwesome> {text}
        </Text>
      </View>
    </View>
  )
}

export default FileListItemSyncStatus
