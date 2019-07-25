import { Navigation } from 'react-native-navigation'
import { Provider } from 'react-redux'
import { getStorybookUI, configure } from '@storybook/react-native'

import { appConfig } from 'config/app'
import { registerScreens } from 'view/screens'
import { showSplash } from './navigation'
import store from 'store'
import { UIManager } from 'react-native';

UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true)

const app = () => {
  Navigation.events().registerAppLaunchedListener(() => {
    registerScreens({ store, Provider })
    Navigation.setDefaultOptions({
      topBar: { visible: true },
    })

    showSplash()
  })
}

const storybook = () => {
  configure(() => {
    require('../../storybook/stories')
  }, module)

  const StorybookUI = getStorybookUI({ port: 7007, onDeviceUI: true })
  Navigation.registerComponent('storybook.UI', () => StorybookUI)
  Navigation.events().registerAppLaunchedListener(async () => {
    await Navigation.setRoot({
      root: {
        component: {
          name: 'storybook.UI',
        },
      },
    })
  })
}

export default (appConfig.useStorybook ? storybook : app)
