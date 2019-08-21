import {StyleSheet} from 'react-native';
import { Colors } from 'themes/colors';
import Fonts from 'themes/Fonts';
import Metrics from 'themes/Metrics';
import globalStyles from 'themes/globalStyles';
import { headlineStyles } from 'themes/levels';

export default StyleSheet.create({
  ...globalStyles,
  ...headlineStyles,
  targetIndicator: {
    height: 1,
    width: '100%',
    backgroundColor: Colors.blue,
    position: 'absolute',
    zIndex: 1,
  },
  draggableWrapper: {
    width: '100%',
    position: 'absolute',
    backgroundColor: Colors.lightGray,
    zIndex: 2,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  column: {
    flexDirection: 'column',
    flex: 1,
  },
  headlineIndicator: {
    fontSize: Fonts.size.h4,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.lightGray,
    width: 22,
    height: 22,
    padding: Metrics.smallMargin,
  },
  headlineIndicatorWrapper: {
    alignItems: 'flex-end',
    marginRight: Metrics.smallMargin,
  },
  headlineIndicatorIcon: {
    color: Colors.white,
    // marginTop: -4,
  },
  contentPreviewText: {
    ...Fonts.style.label,
    fontSize: Fonts.size.small,
    color: Colors.base01,
  },
});
