import { StyleSheet } from 'react-native';
import { Fonts, Metrics, Colors, ApplicationStyles } from '../../themes/';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  ...Fonts.style,

  breadcrumbs: {
    // fontSize: Fonts.size.small,
    // padding: Metrics.doubleBaseMargin,
    paddingTop: Metrics.doubleBaseMargin,
    paddingBottom: 0,
    flexDirection: 'row',
  },
});
