import {UIManager} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {Provider} from 'react-redux';
import {registerScreens} from './screens';
import {defaultStack, devLayout} from './layouts';
import {appConfig} from 'config/app';
import store from 'store';
import { iconsLoaded } from 'helpers/icons';

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

Navigation.events().registerAppLaunchedListener(async () => {
  await iconsLoaded
  registerScreens({store, Provider});
  appConfig.showDevScreen ? devLayout() : defaultStack()
});
