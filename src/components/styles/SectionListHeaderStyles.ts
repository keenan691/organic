import { StyleSheet } from 'react-native';

import { Fonts, Metrics, Colors, ApplicationStyles } from '../../themes/';
import { shadeBlend } from '../../utils/functions';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  text: {
    color: Colors.fileText,
    padding: Metrics.baseMargin,
    // height: 60,

    backgroundColor: shadeBlend(0.1, Colors.green),

    // backgroundColor: Colors.lightGray,
    ...Fonts.style.h6,

    fontWeight: 'bold',
    paddingHorizontal: Metrics.doubleBaseMargin,
    textAlign: 'center',
  },
  specialText: {
    color: Colors.white,
    padding: Metrics.baseMargin,
    // height: 60,
    fontWeight: 'bold',
    backgroundColor: shadeBlend(0.3, Colors.primary),
    ...Fonts.style.h6,
    paddingHorizontal: Metrics.doubleBaseMargin,
    textAlign: 'center',
  },
  container: {
    // marginBottom: Metrics.baseMargin
  },
});
