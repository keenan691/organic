import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form';

export default combineReducers({
  settings: require('./SettingsRedux').reducer,
  agenda: require('./AgendaRedux').reducer,
  searchFilter: require('./OrgSearcherFilterRedux').reducer,
  search: require('./OrgSearcherRedux').reducer,
  data: require('./OrgDataRedux').reducer,
  capture: require('./CaptureRedux').reducer,
  navigation: require('./NavigationRedux').reducer,
  sync: require('./SyncRedux').reducer,
  startup: require('./StartupRedux').reducer,
  form: formReducer
})
