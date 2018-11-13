import { StyleSheet } from 'react-native';
import { Colors, Fonts } from '../../themes';
import { Metrics, ApplicationStyles } from '../../themes/';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  ...ApplicationStyles.list,
  container: {
    paddingBottom: Metrics.baseMargin,
  },
  itemText: {
    color: Colors.fileText,
    fontSize: Fonts.size.h5,
  },
  logo: {
    marginTop: Metrics.doubleSection,
    height: Metrics.images.logo,
    width: Metrics.images.logo,
    resizeMode: 'contain',
  },
  centered: {
    alignItems: 'center',
  },
});
