import { Navigation } from 'react-native-navigation';
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import { reduxBatch }  from '@manaflair/redux-batch';
import { reactotronRedux } from "reactotron-redux";
import Immutable from "seamless-immutable";
import RNFS from 'react-native-fs';
import Reactotron  from "reactotron-react-native";
import Realm from 'realm';
import createSagaMiddleware from "redux-saga";
import sagaPlugin from "reactotron-redux-saga";
import storage from "redux-persist/lib/storage";

import { OrgApi } from "org-mode-connection";

import {
  configureNavigation,
  registerNavigationComponents
} from "./navigation";
import StartupRedux from "./redux/StartupRedux";
import immutablePersistenceTransform from "./services/ImmutablePersistenceTransform";
import rootReducer from "./redux";
import rootSaga from "./sagas";
import settings from '../settings';

// * Config

const APP_NAME = "orgAssistant";
const useReactotron = settings.logging;
export const Config = {
  reduxPersist: {
    active: true,
    storeConfig: {
      key: "root",
      storage,
      // blacklist: [],
      whitelist: ["capture", "searchFilter", 'startup'],
      transforms: [immutablePersistenceTransform]
    }
  }
};

// * Reactotron

if (useReactotron) {
  // https://github.com/infinitered/reactotron for more options!
  Reactotron.configure({
    name: "organic",
    host: "192.168.1.4"
  })
    .useReactNative({
      asyncStorage: false, // there are more options to the async storage.
      networking: { // optionally, you can turn it off with false.
        ignoreUrls: /symbolicate/
      },
      // editor: false, // there are more options to editor
      errors: { veto: (stackFrame) => false }, // or turn it off with false
      overlay: false, // just turning off overlay
    })
    .use(reactotronRedux({ onRestore: Immutable }))
    .use(sagaPlugin())
    .use(tron => ({
      onCommand({ type, payload }) {
        if (type === 'custom') {
          console.tron.log(store.dispatch({ type: 'STARTUP'}))
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
   console.tron.log = () => null
   console.tron.logImportant = () => null
   console.tron.warn = () => null
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

  enhancers.push(reduxBatch)
  enhancers.push(applyMiddleware(...middleware));
  enhancers.push(reduxBatch)

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
    sagaMiddleware
    // persistor
  };
};

let { store, sagasManager, sagaMiddleware } = configureStore(
  rootReducer,
  rootSaga
);

if (module.hot) {
  module.hot.accept(() => {
    const newYieldedSagas = require("./sagas").default;
    sagasManager.cancel();
    sagasManager.done.then(() => {
      sagasManager = sagaMiddleware.run(newYieldedSagas);
    });
    const nextRootReducer = require("./redux").reducers;
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

  // registerScreens();

  // Navigation.startSingleScreenApp({
  //   screen: {
  //     screen: 'app.home',
  //     title: 'Homdfdfde',
  //   },
  //   drawer: {
  //     left: {
  //       screen: 'app.side-menu-left',
  //     }
  //   }
  // });

});
// persistor.purge()

console.disableYellowBox = true;
