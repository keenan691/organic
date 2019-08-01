import { startupActions } from 'modules/startup'
import { filesActions } from 'modules/files'
import { entriesActions } from 'modules/entries'

export default {
  ...entriesActions,
  ...filesActions,
  ...startupActions,
}
