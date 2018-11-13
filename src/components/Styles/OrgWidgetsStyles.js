import { StyleSheet } from 'react-native'

import { Colors } from '../../themes';
import { Metrics, ApplicationStyles } from '../../themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  section: {
    marginVertical: Metrics.baseMargin
  },
  threeStatesSwitch: {
    margin: Metrics.smallMargin,
  },
  // threeStatesSelectDialog: {
  //   backgroundColor: Colors.base03,
  //   borderRadius: 4
  // }

})
