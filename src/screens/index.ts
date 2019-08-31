import {Navigation} from 'react-native-navigation';
import Home from './main/Home'
import WebDavSource from './sources/WebDavSource'
import {Other} from './Other';
import Splash from './Splash';
import Search from './Search';
import Main from './Main';
import {DevComponent, DevComponentChooser} from '../../_devscreen';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

const registerComponentWithRedux = (redux: any) => (name, component: any) => {
  Navigation.registerComponentWithRedux(
    name,
    () => gestureHandlerRootHOC(component),
    redux.Provider,
    redux.store,
  );
};

// prettier-ignore
export type Screens =
  'main/Home' |
  'sources/WebDavSource' |
  'Dev' |
  'DevDrawer'

export function registerScreens(redux) {
  registerComponentWithRedux(redux)('main/Home', Home);
  registerComponentWithRedux(redux)('sources/WebDavSource', WebDavSource);
  // TODO register DevScreen only when in dev
  registerComponentWithRedux(redux)('DevDrawer', DevComponentChooser);
  registerComponentWithRedux(redux)('Dev', DevComponent);
  registerComponentWithRedux(redux)('Splash', Splash);
  registerComponentWithRedux(redux)('Search', Search);
}
