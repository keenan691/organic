import React from 'react'
import { storiesOf } from '@storybook/react-native'

import FileList from 'components/file-list'
import { createFileListItem } from 'helpers/test-object-generator'
import moment from 'moment'

const fileListProps: React.ComponentProps<typeof FileList> = {
  files: [
    createFileListItem({ path: undefined }),
    createFileListItem({ isChanged: false }),
    createFileListItem({
      lastSync: moment('2019-04-08').toISOString(),
      mtime: moment('2019-04-05').toISOString(),
    }),
    createFileListItem({
      isChanged: false,
      lastSync: moment('2019-04-05').toISOString(),
      mtime: moment('2019-04-08').toISOString(),
    }),
    createFileListItem({
      lastSync: moment('2019-04-05').toISOString(),
      mtime: moment('2019-04-08').toISOString(),
    }),
    createFileListItem({ isConflicted: true }),
  ],
  openFile: () => null,
  showFileActionsDialog: () => null,
}

storiesOf('FileList', module).add('basic', () => <FileList {...fileListProps} />)
