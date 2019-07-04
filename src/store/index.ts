import { applyMiddleware, compose, createStore, Reducer } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import createSagaMiddleware, { Saga } from 'redux-saga'

import { appConfig } from 'config/app'
import { reactotron } from 'config/reactotron'
import { reduxPersistConfig } from 'config/redux-persist'

import rootReducer from './reducers'
import rootSaga from './effects'

const configureStore = (rootReducer: Reducer, rootSaga: Saga) => {
  const enhancers = []
  const middleware = []

  const sagaMonitor = appConfig.useReactotron ? reactotron.createSagaMonitor() : null
  const sagaMiddleware = createSagaMiddleware({ sagaMonitor })
  middleware.push(sagaMiddleware)

  const reducer = appConfig.useReduxPersist
    ? persistReducer(reduxPersistConfig, rootReducer)
    : rootReducer

  enhancers.push(applyMiddleware(...middleware))
  if (reactotron) enhancers.push(reactotron.createEnhancer())

  const store = createStore(reducer, compose(...enhancers))
  const sagaManager = sagaMiddleware.run(rootSaga)
  const persistor = appConfig.useReduxPersist ? persistStore(store, {}) : null

  return {
    sagaManager,
    sagaMiddleware,
    store,
    persistor,
  }
}

const { store, sagaMiddleware, persistor, ...rest } = configureStore(rootReducer, rootSaga)
let { sagaManager } = rest

if (persistor && appConfig.persistorPurge) persistor.purge()

// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept(async () => {
    const newYieldedSagas = (await import('store/effects')).default
    sagaManager.cancel()
    sagaManager = sagaMiddleware.run(newYieldedSagas)
    const nextRootReducer = (await import('store/reducers')).default
    store.replaceReducer(nextRootReducer)
  })
}

export default store
