import { StyleSheet } from 'react-native';
import { Colors, Fonts, Metrics, ApplicationStyles } from '../../themes/';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
  },
  regularLine: {
    ...Fonts.style.regular,
    lineHeight: 20,
    color: Colors.fileText,
  },
  link: {
    textDecorationLine: 'underline',
    color: Colors.complement1,
  },
  checkboxLine: {
    // ...Fonts.style.h5,

    ...Fonts.style.regular,
    color: Colors.fileText,
    marginBottom: Metrics.smallMargin,
    // color: Colors.base0,
  },
});
