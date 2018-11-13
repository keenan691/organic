import { Platform, StyleSheet } from 'react-native';
import { Colors } from '../../themes';
import { ApplicationStyles, Metrics } from '../../themes/';
import { shadeBlend } from '../../utils/functions';

const styles = StyleSheet.create({
  ...ApplicationStyles.screen,
  indicatorStyle: {
    backgroundColor: Colors.primary,
  },
  bigText: {
    fontSize: 20,
  },
  item: {
    margin: 20,
  },
  text: {
    width: '75%',
    color: Colors.cyan,
    marginBottom: 5,
  },
  icon: {
    backgroundColor: 'transparent',
    color: Colors.red,
  },
  tabBar: {
    backgroundColor: Colors.bg,
    ...Platform.select({
      ios: {
        paddingTop: 20,
      },
      android: {},
    }),
  },
  tabBarLabel: {
    // fontWeight: 'bold',
    color: Colors.menuButton,
  },

  confirmDissmissButton: {
    color: Colors.primary,
    marginLeft: Metrics.doubleBaseMargin,
  },
  confirmDissmissButtonDisabled: {
    color: shadeBlend(0.3, Colors.menuButton),
    marginLeft: Metrics.doubleBaseMargin,
  },
  inputContainer: {
    // backgroundColor: Colors.cyan,
    paddingHorizontal: Metrics.baseMargin + Metrics.smallMargin,
    height: Metrics.baseMargin * 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.bg,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  contentFormContainer: {
    paddingHorizontal: Metrics.baseMargin + Metrics.smallMargin,
    paddingBottom: Metrics.baseMargin * 5 + Metrics.baseMargin,
  },
});

export default styles;
