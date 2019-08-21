import {Navigation} from 'react-native-navigation';
import {Other} from './Other';
import {Home} from './Home';
import Splash from './Splash';
import Search from './Search';
import Main from './Main';

const registerComponentWithRedux = (redux: any) => (name, component: any) => {
  Navigation.registerComponentWithRedux(
    name,
    () => component,
    redux.Provider,
    redux.store,
  );
};

export function registerScreens(redux) {
  registerComponentWithRedux(redux)('Other', Other);
  registerComponentWithRedux(redux)('Home', Home);
  registerComponentWithRedux(redux)('Splash', Splash);
  registerComponentWithRedux(redux)('Search', Search);
  registerComponentWithRedux(redux)('Main', Main);
}
