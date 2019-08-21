import { startupActions } from 'redux/startup'
import { filesActions } from 'redux/files'
import { entriesActions } from 'redux/entries'

export default {
  ...entriesActions,
  ...filesActions,
  ...startupActions,
}
