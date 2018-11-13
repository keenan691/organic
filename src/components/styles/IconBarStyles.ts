import { StyleSheet } from 'react-native';
import { Colors, Fonts, Metrics, ApplicationStyles } from '../../themes/';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  iconButtonText: {
    color: Colors.base3,
    fontSize: Fonts.size.h3,
  },
  iconButton: {
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    borderRadius: 100,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.cyan,
  },
  iconBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Metrics.baseMargin,
    marginTop: Metrics.doubleBaseMargin,
  },
});
