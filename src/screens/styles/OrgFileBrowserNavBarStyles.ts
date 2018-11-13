import { StyleSheet } from 'react-native';
import { Colors, Metrics, ApplicationStyles } from '../../themes';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    paddingVertical: Metrics.smallMargin + 4,
    paddingHorizontal: Metrics.doubleBaseMargin,
    paddingBottom: 0,
    backgroundColor: Colors.cyan,
    flexDirection: 'row',
    alignItems: 'center',
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
  modeValue: {
    fontWeight: 'bold',
    color: Colors.menuButton,
  },
  modeLabel: {
    color: Colors.menuButton,
  },
  modeContainer: {
    flexDirection: 'column',
  },
});
