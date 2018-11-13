import { StyleSheet } from 'react-native';
import { Fonts, Colors, Metrics, ApplicationStyles } from '../../themes/';
import { shadeBlend } from '../../utils/functions';

// * Colors

const PRIMARY_COLOR = shadeBlend(0.5, Colors.status);
const SECONDARY_COLOR = Colors.green;

// * Styles

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  item: {
    // padding: Metrics.smallMargin,
    paddingHorizontal: Metrics.doubleBaseMargin,
    // paddingVertical: Metrics.baseMargin,
    paddingTop: Metrics.baseMargin + Metrics.smallMargin,
    paddingBottom: Metrics.baseMargin + Metrics.smallMargin,
    backgroundColor: Colors.bg,
    // marginBottom: Metrics.baseMargin
    // marginTop: Metrics.doubleBaseMargin
  },
  itemTitle: {
    color: Colors.fileText,
    ...Fonts.style.h4,
    // fontWeight: 'bold'
    // marginBottom: Metrics.smallMargin
  },
  label: {
    flexDirection: 'row',
    // justifyContent: 'flex-end',
    alignItems: 'flex-start',
    // marginTop: Metrics.smallMargin
  },
  labelText: {
    color: PRIMARY_COLOR,
  },
  labelIcon: {
    ...Fonts.style.h5,
    color: Colors.green,
  },

  fileStatus: {
    marginTop: Metrics.smallMargin,
  },

  rowBack: {
    alignItems: 'center',
    backgroundColor: Colors.cyan,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // justifyContent: "flex-start"
    paddingLeft: 15,
  },

  errorMessage: {
    color: Colors.error,
  },

  warningMessage: {
    color: Colors.warning,
  },
});
