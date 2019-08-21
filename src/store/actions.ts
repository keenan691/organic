import { startupActions } from 'redux/startup'
import { filesActions } from 'redux/files'
import { entriesActions } from 'redux/entries'
import { devActions } from 'redux/dev'

export default {
  ...devActions,
  ...entriesActions,
  ...filesActions,
  ...startupActions,
}
