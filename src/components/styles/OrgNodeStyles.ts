import { StyleSheet } from 'react-native';
import { Fonts, Colors, Metrics, ApplicationStyles } from '../../themes/';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  h1: {
    color: Colors.red,
    fontSize: Fonts.size.h5,
  },
  h2: {
    color: Colors.green,
    fontSize: Fonts.size.h6,
  },
  h3: {
    color: Colors.blue,
    fontSize: Fonts.size.h6,
  },
  h4: {
    color: Colors.yellow,
    fontSize: Fonts.size.h6,
  },
  h5: {
    color: Colors.cyan,
    fontSize: Fonts.size.h6,
  },
  h6: {
    color: Colors.red,
    fontSize: Fonts.size.h6,
  },
  level: {
    color: Colors.base2,
  },
  todo: {
    color: Colors.magenta,
    fontWeight: 'normal',
  },
  priority: {
    color: Colors.green,
    fontWeight: 'bold',
  },
  contentContainer: {
    // backgroundColor: Colors.base01,
    flex: 1,
  },
  contentText: {
    ...Fonts.style.normal,
    color: Colors.base0,
  },
  nodeContainer: {
    padding: Metrics.baseMargin,
  },
  icon: {
    marginLeft: -10,
  },
});
