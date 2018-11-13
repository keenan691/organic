import { StyleSheet } from 'react-native';
import { Fonts, Colors, Metrics, ApplicationStyles } from '../../themes/';

export const TOC_FOLDING_LEVEL = 2;
export const HEADER_MIN_HEIGHT = 0;
export const HEADER_MAX_HEIGHT = 108.5;
export const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  fill: {
    flex: 1,
  },
  row: {
    height: 40,
    margin: 16,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.bg,
    overflow: 'hidden',
  },
  bar: {},
  title: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 18,
  },
  scrollViewContent: {
    paddingTop: HEADER_MAX_HEIGHT,
  },
  orgFileContainer: {
    borderBottomColor: Colors.base03,
    borderBottomWidth: 1,
    backgroundColor: Colors.res,
    marginHorizontal: Metrics.baseMargin,
    paddingBottom: Metrics.baseMargin,
  },
  fileNameTitleText: {
    color: Colors.fileText,
    ...Fonts.style.h2,
  },
  statusText: {
    color: Colors.base1,
  },
  fileHeader: {
    borderBottomColor: Colors.fileText,
    borderBottomWidth: 1,
  },
  breadcrumbsText: {
    color: Colors.fileText,
  },
  nodeActionsToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Metrics.doubleBaseMargin,
    paddingVertical: Metrics.smallMargin,
    // marginTop: Metrics.baseMargin,
    backgroundColor: Colors.cyan,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingTop: Metrics.doubleBaseMargin - Metrics.smallMargin,
  },
  toolbarButtonText: {
    color: 'white',
    ...Fonts.style.label,
  },
  toolbarButtonIcon: {
    color: 'white',
    ...Fonts.style.h4,
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
    fontSize: Fonts.size.h1 + 10,
    marginRight: Metrics.doubleBaseMargin + 5,
    color: Colors.magenta,
  },
  fileTitle: {
    // paddingBottom: Metrics.baseMargin,
    color: Colors.fileText,
    // Left: Metrics.doubleBaseMargin,
    // backgroundColor: Colors.base1,
    // paddingTop: Metrics.doubleBaseMargin,
    ...Fonts.style.h4,
  },
  fileTitleContainer: {
    paddingHorizontal: Metrics.doubleBaseMargin,
    // backgroundColor: Colors.cyan,
  },
  sectionContainer: {
    marginHorizontal: Metrics.doubleBaseMargin,
  },
  h0: {
    ...Fonts.style.h5,
  },
});
