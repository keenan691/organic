import { startupActions } from 'core/startup'
import { filesActions } from 'core/files'
import { entriesActions } from 'core/entries'

export default {
  ...entriesActions,
  ...filesActions,
  ...startupActions,
}
