import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics } from 'view/themes'
import { headlineStyles } from 'view/styles/levels';
import globalStyles from 'view/styles/global';

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
  draggable: {
    width: '100%',
    position: 'absolute',
    backgroundColor: Colors.lightGray,
    borderColor: Colors.darkerGray,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    // opacity: 0.8,
    zIndex: 2,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  column: {
    flexDirection: 'column',
    flex: 1
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
    marginTop: -4,
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // fontSize: Fonts.size.regular,
  },
  headlineIndicatorHasContent: {
    // borderColor: Colors.violet
  },
  contentPreviewText: {
    ...Fonts.style.label,
    fontSize: Fonts.size.small,
    color: Colors.white,
    // marginTop: -7
  },
})
