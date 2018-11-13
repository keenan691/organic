import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

export default combineReducers({
  agenda: require('./AgendaRedux').reducer,
  capture: require('./CaptureRedux').reducer,
  data: require('./OrgDataRedux').reducer,
  form: formReducer,
  navigation: require('./NavigationRedux').reducer,
  search: require('./OrgSearcherRedux').reducer,
  searchFilter: require('./OrgSearcherFilterRedux').reducer,
  settings: require('./SettingsRedux').reducer,
  startup: require('./StartupRedux').reducer,
  sync: require('./SyncRedux').reducer,
});
