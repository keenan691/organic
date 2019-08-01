import React from 'react'
import { Text, TouchableOpacity } from 'react-native'

import styles from './styles'
import { getFileTitle, createFileSyncMessages } from './helpers'
import { OrgFile } from 'modules/files/store/types'
import FileListItemSyncStatus from './item-sync-status'

type Props = {
  item: OrgFile
  onPress: () => void
  onLongPress: () => void
}

function FileListItem({ item, onPress, onLongPress }: Props) {
  const fileName = getFileTitle(item)
  const syncMessage = createFileSyncMessages(item)
  return (
    <TouchableOpacity style={[styles.item]} onPress={onPress} onLongPress={onLongPress}>
      <Text style={styles.itemTitle}>{fileName}</Text>
      <FileListItemSyncStatus message={syncMessage} />
    </TouchableOpacity>
  )
}

export default FileListItem
