import { StyleSheet } from 'react-native';

import { Colors, Fonts } from '../../themes';
import { Metrics, ApplicationStyles } from '../../themes/';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  section: {
    marginVertical: Metrics.baseMargin,
  },
  threeStatesSwitch: {
    margin: Metrics.smallMargin,
  },
  emptyItem: {
    color: Colors.button,
    marginTop: Metrics.baseMargin,
    marginHorizontal: Metrics.smallMargin,
    fontSize: Fonts.size.regular,
  },
  // threeStatesSelectDialog: {
  //   // backgroundColor: Colors.base03,
  //   // borderRadius: 4,
  //   paddingBottom: Metrics.baseMargin,
  //   margin: 20
  // }
});
