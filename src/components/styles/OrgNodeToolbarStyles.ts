import { StyleSheet } from 'react-native';

import { ApplicationStyles, Colors, Fonts, Metrics } from '../../themes';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  nodeActionsToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Metrics.doubleBaseMargin,
    paddingVertical: Metrics.smallMargin,
    // marginTop: Metrics.baseMargin,
    backgroundColor: Colors.button,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingTop: Metrics.doubleBaseMargin - Metrics.smallMargin,
  },
  toolbarButtonText: {
    color: Colors.white,
    // fontWeight: 'bold',
    ...Fonts.style.label,
  },
  toolbarButtonIcon: {
    color: Colors.white,
    ...Fonts.style.h4,
  },
});
