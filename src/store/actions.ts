import { startupActions } from 'redux/startup'
import { filesActions } from 'redux/files'
import { entriesActions } from 'redux/entries'
import { devActions } from 'redux/dev'
import { sourcesActions } from 'redux/sources'

export default {
  ...sourcesActions,
  ...devActions,
  ...entriesActions,
  ...filesActions,
  ...startupActions,
}
