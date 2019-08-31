import {Navigation} from 'react-native-navigation';
import WebDavSource from './sources/WebDavSource'
import Editor from './main/Editor'
import {Other} from './Other';
import Home from './Home';
import Splash from './Splash';
import Search from './Search';
import Main from './Main';
import {DevComponent, DevComponentChooser} from '../../_devscreen';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

const registerComponentWithRedux = (redux: any) => (name, component: any) => {
  Navigation.registerComponentWithRedux(
    name,
    () => component,
    redux.Provider,
    redux.store,
  );
};

// prettier-ignore
export type Screens =
  'sources/WebDavSource' |
  'main/Editor' |
  'Dev' |
  'DevDrawer'

export function registerScreens(redux) {
  registerComponentWithRedux(redux)('sources/WebDavSource', WebDavSource);
  registerComponentWithRedux(redux)('main/Editor', Editor);
  // TODO register DevScreen only when in dev
  registerComponentWithRedux(redux)('DevDrawer', DevComponentChooser);
  registerComponentWithRedux(redux)('Dev', DevComponent);
  registerComponentWithRedux(redux)('Other', Other);
  registerComponentWithRedux(redux)('Home', Home);
  registerComponentWithRedux(redux)('Splash', Splash);
  registerComponentWithRedux(redux)('Search', Search);
  registerComponentWithRedux(redux)('Main', Main);
}
