import { StyleSheet } from 'react-native';

import { Colors, Fonts } from '../../themes';
import { Metrics, ApplicationStyles } from '../../themes/';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  section: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: Metrics.doubleBaseMargin,
    paddingTop: Metrics.doubleBaseMargin - 4,
  },
  titleText: {
    ...Fonts.style.h6,
    color: Colors.fileText,
    paddingLeft: Metrics.menuButton + 20,
  },
});
