import { Navigation } from 'react-native-navigation'

import { TYPOGRAPHY } from 'view/styles/typography'
import { Screens } from "view/screens/types"

export const showSplash = () => {
  Navigation.setRoot({
    root: {
      component: { name: <Screens>'Splash' },
    },
  })
}

export const tabbedNavigation = () =>
  Navigation.setRoot({
    root: {
      bottomTabs: {
        id: 'BottomTabsId',
        children: [
          {
            stack: {
              children: [
                {
                  component: {
                    name: <Screens>'Splash',
                    passProps: {
                      text: 'This is Home',
                    },
                  },
                },
              ],
              options: {
                topBar: {
                  visible: false,
                  drawBehind: true,
                  animate: true,
                },
                bottomTab: {
                  fontSize: 12,
                  text: 'Home',
                  textColor: TYPOGRAPHY.COLOR.Primary,
                  selectedTextColor: TYPOGRAPHY.COLOR.Secondary,
                  icon: require('../view/assets/images/tabbar/home.png'),
                  selectedIcon: require('../view/assets/images/tabbar/home.png'),
                },
              },
            },
          },
        ],
      },
    },
  })

export default tabbedNavigation
