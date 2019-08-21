import {Navigation} from 'react-native-navigation';

export const defaultStack = () =>
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'Splash',
            },
          },
        ],
      },
    },
  });
