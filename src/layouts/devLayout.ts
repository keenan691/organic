import {Navigation} from 'react-native-navigation';

export const devLayout = () =>
  Navigation.setRoot({
    root: {
      sideMenu: {
        left: {
          component: {
            name: 'DevDrawer',
          },
        },
        center: {
          stack: {
            children: [
              {
                component: {
                  name: 'Dev',
                },
              }
            ]
          },
        },
      },
    },
  });
