import { StyleSheet } from 'react-native';
import { ApplicationStyles, Colors, Fonts, Metrics } from '../../themes';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  sectionButtonText: {
    // paddingRight: Metrics.doubleBaseMargin,
    // paddingVertical: Metrics.baseMargin,
    color: Colors.fileText,
    // fontWeight: "bold",
    marginTop: Metrics.smallMargin,
  },
  modalBg: {
    width: '100%',
    height: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    backgroundColor: Colors.bg,
    height: 380,
    width: 300,
    padding: Metrics.doubleBaseMargin,
  },
  modalActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // padding: Metrics.doubleBaseMargin
  },
  subsectionContainer: {
    paddingVertical: Metrics.baseMargin,
    flexDirection: 'column',
  },
  modalTitleText: {
    fontSize: Fonts.size.h4,
    fontWeight: 'bold',
    marginBottom: Metrics.doubleBaseMargin,
    color: Colors.fileText,
  },
  modalAction: {
    fontWeight: 'bold',
    color: Colors.fileText,
  },
  modalContent: {
    // justifyContent: 'flex-start',
    // marginHorizontal: Metrics.doubleBaseMargin
  },
  sectionText: {
    fontSize: Fonts.size.h6,
    marginBottom: Metrics.baseMargin,
  },
  status: {
    marginVertical: Metrics.doubleBaseMargin,
  },
  column: {
    width: '50%',
    // flexDirection: 'column',
    // justifyContent: 'flex-start'
    // padding: Metrics.doubleBaseMargin
  },
  leftCol: {
    paddingRight: Metrics.doubleBaseMargin,
  },
  rightCol: {
    paddingLeft: Metrics.doubleBaseMargin,
  },
  value: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  row: {
    paddingVertical: Metrics.doubleBaseMargin,
  },
});
