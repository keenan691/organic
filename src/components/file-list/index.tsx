import React from 'react'
import { FlatList } from 'react-native'

import { OrgFile } from 'core/files/store/types'
import { Separator, Empty } from 'elements'
import FileListItem from './item'
import STRINGS from 'view/constants/strings'

type Props = {
  files: OrgFile[]
  openFile: () => void
  showFileActionsDialog: () => void
} & typeof defaultProps

const defaultProps = {}

function FileList(props: Props) {
  return (
    <FlatList
      keyExtractor={item => item.id}
      data={props.files}
      renderItem={({ item }) => (
        <FileListItem
          item={item}
          onPress={props.openFile}
          onLongPress={props.showFileActionsDialog}
        />
      )}
      ItemSeparatorComponent={Separator}
      ListEmptyComponent={() => (
        <Empty itemName={STRINGS.file.namePlural} message={STRINGS.file.emptyDescription} />
      )}
    />
  )
}

FileList.defaultProps = defaultProps

export default FileList
