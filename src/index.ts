// * index.ts<src>

// ** License

/**
 * Copyright (C) 2018, Bartłomiej Nankiewicz<bartlomiej.nankiewicz@gmail.com>
 *
 * This file is part of Organic.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// * Imports

import { reduxBatch } from '@manaflair/redux-batch';
import { OrgApi } from 'org-mode-connection';
import RNFS from 'react-native-fs';
import { Provider } from 'react-redux';
import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';
import sagaPlugin from 'reactotron-redux-saga';
import Realm from 'realm';
import { applyMiddleware, compose, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import createSagaMiddleware from 'redux-saga';
import Immutable from 'seamless-immutable';
import settings from '../settings';
import { configureNavigation, registerNavigationComponents } from './navigation';
import rootReducer from './redux';
import StartupRedux from './redux/StartupRedux';
import rootSaga from './sagas';
import immutablePersistenceTransform from './services/ImmutablePersistenceTransform';

// * Config

const useReactotron = settings.logging;

export const Config = {
  reduxPersist: {
    active: true,
    storeConfig: {
      key: 'root',
      storage,
      // blacklist: [],
      whitelist: ['capture', 'searchFilter', 'startup'],
      transforms: [immutablePersistenceTransform],
    },
  },
};

// * Reactotron

if (useReactotron) {
  // https://github.com/infinitered/reactotron for more options!
  Reactotron.configure({
    name: 'organic',
    host: '192.168.1.4',
  })
    .useReactNative({
      asyncStorage: false, // there are more options to the async storage.
      networking: {
        // optionally, you can turn it off with false.
        ignoreUrls: /symbolicate/,
      },
      // editor: false, // there are more options to editor
      errors: { veto: (stackFrame) => false }, // or turn it off with false
      overlay: false, // just turning off overlay
    })
    .use(reactotronRedux({ onRestore: Immutable }))
    .use(sagaPlugin())
    .use((tron) => ({
      onCommand({ type, payload }) {
        if (type === 'custom') {
          console.tron.log(store.dispatch({ type: 'STARTUP' }));
        }
      },
    }))
    .connect();

  // Let's clear Reactotron on every time we load the app
  Reactotron.clear();

  // Totally hacky, but this allows you to not both importing reactotron-react-native
  // on every file.  This is just DEV mode, so no big deal.
  console.tron = Reactotron;
} else {
  console.tron = () => null;
  console.tron.log = () => null;
  console.tron.logImportant = () => null;
  console.tron.warn = () => null;
  console.log = () => null;
  console.debug = () => null;
  console.warn = () => null;
}

const configureStore = (rootReducer, rootSaga) => {
  /* ------------- Redux Configuration ------------- */

  const middleware = [];
  const enhancers = [];

  /* ------------- Saga Middleware ------------- */

  const sagaMonitor = useReactotron ? console.tron.createSagaMonitor() : null;
  const sagaMiddleware = createSagaMiddleware({ sagaMonitor });
  middleware.push(sagaMiddleware);

  /* ------------- Assemble Middleware ------------- */

  enhancers.push(reduxBatch);
  enhancers.push(applyMiddleware(...middleware));
  enhancers.push(reduxBatch);

  // if Reactotron is enabled (default for __DEV__), we'll create the store through Reactotron
  const createAppropriateStore = useReactotron
    ? console.tron.createStore
    : createStore;

  const reducer = Config.reduxPersist.active
    ? persistReducer(Config.reduxPersist.storeConfig, rootReducer)
    : rootReducer;

  const store = createAppropriateStore(reducer, compose(...enhancers));

  // kick off root saga
  const sagasManager = sagaMiddleware.run(rootSaga);

  return {
    store,
    sagasManager,
    sagaMiddleware,
    // persistor
  };
};

let { store, sagasManager, sagaMiddleware } = configureStore(
  rootReducer,
  rootSaga,
);

if (module.hot) {
  module.hot.accept(() => {
    const newYieldedSagas = require('./sagas').default;
    sagasManager.cancel();
    sagasManager.done.then(() => {
      sagasManager = sagaMiddleware.run(newYieldedSagas);
    });
    const nextRootReducer = require('./redux').reducers;
    store.replaceReducer(nextRootReducer);
  });
}

const persistor = persistStore(store, null, () => {
  registerNavigationComponents(store, Provider);
  configureNavigation();

  OrgApi.configureFileAccess(RNFS);
  OrgApi.configureDb(Realm);
  OrgApi.connectDb();

  store.dispatch(StartupRedux.startup());

});

// persistor.purge()

console.disableYellowBox = true;
