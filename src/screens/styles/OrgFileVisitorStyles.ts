import { StyleSheet } from 'react-native';
import { Fonts, Colors, Metrics, ApplicationStyles } from '../../themes/';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  orgFileContainer: {
    borderBottomColor: Colors.base03,
    borderBottomWidth: 1,
    backgroundColor: Colors.res,
    marginHorizontal: Metrics.baseMargin,
    paddingBottom: Metrics.baseMargin,
  },
  fileNameTitleText: {
    color: Colors.cyan,
    ...Fonts.style.h2,
  },
  statusText: {
    color: Colors.base1,
  },
  header: {
    backgroundColor: Colors.base03,
    // marginBottom: Metrics.baseMargin,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: Metrics.baseMargin,
    backgroundColor: Colors.base03,
  },
  nodeNavigation: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  navButton: {
    fontSize: Fonts.size.h1,
    color: Colors.cyan,
    padding: Metrics.baseMargin,
  },
});
