import { StyleSheet } from 'react-native';

import { Fonts, Colors, Metrics, ApplicationStyles } from '../../themes/';
import { shadeBlend } from '../../utils/functions';

// * Const

const shade = (c) => shadeBlend(0.2, c);
const light = (c) => shadeBlend(0.2, c);

const border = (color) => ({
  borderTopColor: color,
  borderTopWidth: 1,
  borderBottomColor: color,
  borderBottomWidth: 1,
});

export const orgHeadersColors = [
  light(Colors.complementRed),

  shadeBlend(0.2, Colors.afterblue),
  Colors.complement1,
  shadeBlend(0.1, Colors.violet),
  Colors.cyan,
  Colors.yellow,
];

// * Styles

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  agendaDisplay: {
    color: Colors.complement1,
  },
  visitedNodeBg: {
    backgroundColor: Colors.cyan,
    // ...border(Colors.bas)
  },
  visitedHeadline: {
    color: 'white',
    fontSize: Fonts.size.h4,
  },
  h0: {
    color: Colors.fileText,
    fontSize: Fonts.size.regular,
  },
  h1: {
    color: orgHeadersColors[0],
    fontSize: Fonts.size.regular,
  },
  h2: {
    color: orgHeadersColors[1],
    fontSize: Fonts.size.regular,
  },
  h3: {
    color: orgHeadersColors[2],
    fontSize: Fonts.size.regular,
  },
  h4: {
    color: orgHeadersColors[3],
    fontSize: Fonts.size.regular,
  },
  h5: {
    color: orgHeadersColors[0],
    fontSize: Fonts.size.regular,
  },
  h6: {
    color: orgHeadersColors[1],
    fontSize: Fonts.size.regular,
  },
  h7: {
    color: orgHeadersColors[2],
    fontSize: Fonts.size.regular,
  },
  h8: {
    color: orgHeadersColors[3],
    fontSize: Fonts.size.regular,
  },
  h9: {
    color: orgHeadersColors[4],
    fontSize: Fonts.size.regular,
  },
  h10: {
    color: orgHeadersColors[0],
    fontSize: Fonts.size.regular,
  },
  h11: {
    color: orgHeadersColors[1],
    fontSize: Fonts.size.regular,
  },
  level: {
    color: Colors.bg,
  },
  todo: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  doneText: {
    color: Colors.green,
  },
  deadline: {
    color: Colors.special,
  },
  tags: {
    fontWeight: 'bold',
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
    paddingHorizontal: Metrics.doubleBaseMargin,
    // backgroundColor: Colors.bg
  },
  icon: {
    marginLeft: -10,
  },

  listStickedSectionText: {
    color: Colors.white,
    padding: Metrics.baseMargin,
    backgroundColor: Colors.secondary,
    ...Fonts.style.h4,
    paddingHorizontal: Metrics.doubleBaseMargin - Metrics.smallMargin - 1,
  },
  leftAction: {
    flex: 1,
    backgroundColor: '#497AFC',
    justifyContent: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 10,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  separator: {
    backgroundColor: 'rgb(200, 199, 204)',
    height: StyleSheet.hairlineWidth,
  },
  fromText: {
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  messageText: {
    color: '#999',
    backgroundColor: 'transparent',
  },
  dateText: {
    backgroundColor: 'transparent',
    position: 'absolute',
    right: 20,
    top: 10,
    color: '#999',
    fontWeight: 'bold',
  },
  standalone: {
    marginTop: 30,
    marginBottom: 30,
  },
  standaloneRowFront: {
    alignItems: 'center',
    backgroundColor: '#CCC',
    justifyContent: 'center',
    height: 50,
  },
  standaloneRowBack: {
    alignItems: 'center',
    backgroundColor: '#8BC645',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  backTextWhite: {
    color: '#FFF',
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#CCC',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 50,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // justifyContent: "flex-start"
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: 'blue',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
  },
  controls: {
    alignItems: 'center',
    marginBottom: 30,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
  },
  switch: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    paddingVertical: 10,
  },
  actionButton: {
    padding: Metrics.baseMargin,
    backgroundColor: Colors.cyan,
  },
  actionButtonText: {
    color: 'white',
  },
  category: {
    fontSize: Fonts.size.small,
    color: shadeBlend(-0.2, Colors.green),
    fontWeight: 'bold',
  },
  categoryContainer: {
    position: 'absolute',
    bottom: -1,
    left: 20,
  },
  agendaContainer: {
    position: 'absolute',
    bottom: -4,
    right: 20,
  },
  link: {
    textDecorationLine: 'underline',
  },
});
