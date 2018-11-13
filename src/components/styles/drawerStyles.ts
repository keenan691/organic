import { Metrics, Colors, ApplicationStyles } from '../../themes/';

import { StyleSheet, Platform, Dimensions } from 'react-native';
export default StyleSheet.create({
  ...ApplicationStyles.screen,
  ...ApplicationStyles.modal,

  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingTop: Metrics.doubleBaseMargin,
    ...Platform.select({
      ios: {
        width: '100%',
      },
      android: {
        width: Dimensions.get('window').width * 0.75, // on android width must be set
      },
    }),
  },
});
