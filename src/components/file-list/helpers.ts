import moment from 'moment'

import { OrgFile } from 'core/files/store/types'
import FileListItemSyncStatus from './item-sync-status'
import STRINGS from 'view/constants/strings'

export const getFileName = (path: string) => path && path.split('/')[-1]
export const getFileTitle = ({ path, metadata }: OrgFile) =>
  metadata.TITLE || getFileName(path) || null

export const createFileSyncMessages = ({
  path,
  lastSync,
  mtime,
  isChanged,
}: OrgFile): React.ComponentProps<typeof FileListItemSyncStatus>['message'] => {
  if (!path) return { text: STRINGS.sync.notConnected, type: 'info' }

  const mtimeFromNow = moment(mtime).fromNow()
  const hasRemoteChanges = mtime > lastSync

  if (isChanged && hasRemoteChanges) return { text: STRINGS.sync.hasConflicts, type: 'error' }

  if (isChanged) return { text: STRINGS.sync.hasLocalChanges, type: 'warning' }

  if (hasRemoteChanges) return { text: STRINGS.sync.hasRemoteChanges, type: 'warning' }

  return { text: mtimeFromNow, type: 'info' }
}
