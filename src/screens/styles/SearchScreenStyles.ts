import { Platform, StyleSheet } from 'react-native';
import { Colors } from '../../themes';
import { Metrics, ApplicationStyles } from '../../themes/';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {},
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
  indicatorStyle: {
    backgroundColor: Colors.secondary,
  },
  labelStyle: {
    color: Colors.tabBarText,
  },
  tabBar: {
    backgroundColor: Colors.tabBarBg,
    ...Platform.select({
      ios: {
        paddingTop: 20,
      },
      android: {},
    }),
  },
});
