import {Navigation} from 'react-native-navigation';
import {registerScreens} from './screens';
import {defaultStack} from './layouts';
import {UIManager} from 'react-native';
import {Provider} from 'react-redux';
import store from 'store';
import {appConfig} from 'config/app';
import { getStorybookUI, configure } from '@storybook/react-native'
import React, { Component } from 'react';
import StorybookUIHMRRoot from '../storybook';

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

if (appConfig.useStorybook) {
  Navigation.registerComponent('storybook.UI', () => StorybookUIHMRRoot);
  Navigation.events().registerAppLaunchedListener(async () => {
    Navigation.setRoot({
      root: {
        sideMenu: {
          left: {
            component: {
              name: 'storybook.UI',
            },
          },
          center: {
            component: {
              name: 'storybook.UI',
            },
          }
        },
      },
    });
  });
} else {
  registerScreens({store, Provider});
  Navigation.events().registerAppLaunchedListener(async () => {
    defaultStack();
  });
}
