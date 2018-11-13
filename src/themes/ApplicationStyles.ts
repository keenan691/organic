import { Platform } from 'react-native';

import { shadeBlend } from '../utils/functions';
import Colors from './Colors';
import Fonts from './Fonts';
import Metrics from './Metrics';

// * Screen

const screen = {
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    // backgroundColor: "red"
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: Colors.separator,
    marginHorizontal: Metrics.doubleBaseMargin,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.base02,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  container: {
    backgroundColor: Colors.bg,
    flex: 1,
  },
  label: {
    ...Fonts.style.label,
    color: Colors.base0,
    // fontWeight: 'bold',
    // margin: Metrics.smallMargin
  },
  normalText: {
    color: Colors.base1,
    ...Fonts.style.normal,
  },
  sectionText: {
    ...Fonts.style.normal,
    paddingVertical: Metrics.doubleBaseMargin,
    padding: Metrics.baseMargin,
    color: Colors.base1,
    marginVertical: Metrics.smallMargin,
  },
  subtitleText: {
    color: Colors.base0,
    padding: Metrics.smallMargin,
    // marginBottom: Metrics.smallMargin,
    marginHorizontal: Metrics.smallMargin,
  },
  titleText: {
    ...Fonts.style.h4,
    color: Colors.magenta,
    // padding: Metrics.baseMargin,
    // marginBottom: Metrics.baseMargin - Metrics.smallMargin,
    // paddingBottom: 0,
    marginHorizontal: Metrics.smallMargin,
  },
};

// * Navigation Bar Styles

export const ContextMenuStyles = {
  primary: {
    navBarBackgroundColor: Colors.editMenuColor,
    // navBarButtonColor: Colors.white
  },
};

// * Application Styles

const ApplicationStyles = {
  screen,
  modal: {
    titleText: {
      textAlign: 'center',
      fontSize: Fonts.size.h5,
    },
  },
  list: {
    itemContainer: {
      paddingHorizontal: Metrics.doubleBaseMargin,
      // paddingVertical: Metrics.baseMargin,
      paddingTop: Metrics.baseMargin + Metrics.smallMargin,
      paddingBottom: Metrics.baseMargin + Metrics.smallMargin,
      backgroundColor: Colors.bg,
    },
  },
  tabBar: {
    indicatorStyle: {
      backgroundColor: Colors.magenta,
    },
    labelStyle: {
      color: Colors.tabBarText,
    },
    tabBar: {
      backgroundColor: Colors.tabBarBg,
      ...Platform.select({
        ios: {
          paddingTop: 20,
        },
        android: {},
      }),
    },
  },
  orgTodoStates: {
    done: {
      color: Colors.green,
    },
    todo: {
      color: Colors.blue,
    },
  },
  divider: {
    borderBottomColor: Colors.base03,
    // marginBottom: Metrics.baseMargin,
    // paddingBottom: Metrics.baseMargin,
    borderBottomWidth: 1,
  },
  darkLabelContainer: {
    padding: Metrics.smallMargin,
    paddingBottom: Metrics.doubleBaseMargin,
    borderBottomColor: Colors.base03,
    borderBottomWidth: 1,
    marginBottom: Metrics.baseMargin,
  },
  darkLabel: {
    fontFamily: Fonts.type.bold,
    color: Colors.snow,
  },
  groupContainer: {
    margin: Metrics.smallMargin,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  sectionTitle: {
    ...Fonts.style.h4,
    color: Colors.coal,
    backgroundColor: Colors.ricePaper,
    padding: Metrics.smallMargin,
    marginTop: Metrics.smallMargin,
    marginHorizontal: Metrics.baseMargin,
    borderWidth: 1,
    borderColor: Colors.ember,
    alignItems: 'center',
    textAlign: 'center',
  },
};

export const NavigatorStyle = {
  // navBarHidden: true,
  // drawUnderNavBar: true,
  // navBarBlur: true,
  // navBarTranslucent: true,
  // navBarTransparent: true,
  navBarSubtitleColor: Colors.fileText, // subtitle color
  // navBarSubtitleFontFamily: 'font-name', // subtitle font, 'sans-serif-thin' for example
  // navBarSubtitleFontSize: 13, // subtitle font size
  navBarButtonColor: Colors.menuButton,
  navBarTextColor: Colors.menuButton,
  topBarElevationShadowEnabled: true,
  screenBackgroundColor: Colors.bg,
  navBarBackgroundColor: Colors.cyan,
  statusBarColor: Colors.magenta,
  statusBarTextColorScheme: 'dark',
  // navBarRightButtonFontSize: 17, // Change font size of right nav bar button
  // navBarRightButtonColor: 'blue', // Change color of right nav bar button
  // navBarRightButtonFontWeight: '600', // Change font weight of right nav bar button
  contextualMenuStatusBarColor: Colors.statusBarColor,
  contextualMenuBackgroundColor: shadeBlend(0, Colors.bg),
  contextualMenuButtonsColor: shadeBlend(0, Colors.primary),
};

export const NavigatorStyleAlternative = {
  ...NavigatorStyle,
  statusBarColor: Colors.magenta,
  navBarBackgroundColor: Colors.bg,
  navBarButtonColor: Colors.magenta,
  navBarTextColor: Colors.magenta,
};

export const NavigatorStyleDupa = {
  ...NavigatorStyle,
  statusBarColor: Colors.statusBarColor,
  navBarBackgroundColor: Colors.cyan,
  navBarButtonColor: Colors.menuButton,
  // navBarTextColor: Colors.white
};

export const NavigatorStyleSpecial = {
  ...NavigatorStyle,
  statusBarColor: Colors.statusBarColor,
  navBarBackgroundColor: Colors.bg,
  navBarButtonColor: Colors.violet,
  navBarTextColor: Colors.violet,
};

export const NavigatorStyleMagenta = {
  ...NavigatorStyle,
  statusBarColor: Colors.statusBarColor,
  navBarBackgroundColor: Colors.bg,
  navBarButtonColor: Colors.magenta,
  navBarTextColor: Colors.magenta,
};

export default ApplicationStyles;
