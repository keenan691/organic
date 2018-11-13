import { Platform, StyleSheet } from 'react-native';
import { Colors } from '../../themes';
import { Metrics, ApplicationStyles } from '../../themes/';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    marginBottom: Metrics.baseMargin,
    // paddingHorizontal: 22
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
  icon: {
    color: Colors.tabBarText,
  },
  ...ApplicationStyles.tabBar,
});
