import storage from 'redux-persist/lib/storage'

const reduxPersistConfig = {
  key: 'root',
  storage,
  whitelist: ['startup'],
}

export { reduxPersistConfig }
