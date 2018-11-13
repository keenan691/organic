// * navigation.js starts here
// * Imports

import { BackHandler, InteractionManager, Vibration, View } from "react-native";
import { Navigation } from "react-native-navigation";
import { PersistGate } from "redux-persist/integration/react";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";
import R from "ramda";
import React, { Component } from "react";

import { Colors } from "./themes";
import { EditActionButtons } from "./components/OrgNodesList";
import { NavigatorStyleDupa } from "./themes/ApplicationStyles";
import { rootComponentHOC, withBusyScreen } from "./components/HOCs";
import { vibrate } from "./vibrations";
import AgendaScreen from "./screens/AgendaScreen";
import BusyScreen from "./components/BusyScreen";
import CaptureScreen from "./screens/CaptureScreen";
import DevScreen from "./screens/DevScreen";
import Drawer from "./components/drawer";
import LastCapturedScreen from './screens/LastCapturedScreen';
import NotesScreen from "./screens/NotesScreen";
import OrgDataRedux from "./redux/OrgDataRedux";
import OrgFileBrowserNavBar from "./screens/OrgFileBrowserNavBar";
import OrgFileBrowserScreen from "./screens/OrgFileBrowserScreen";
import OrgFilesScreen from "./screens/OrgFilesScreen";
import OrgNodeEditScreen from "./screens/OrgNodeEditScreen";
import SearchResultsScreen from "./screens/SearchResultsScreen";
import SearchScreen from "./screens/SearchScreen";
import loadIcons from "./utils/loadIcons";
import settings from '../settings';

var PushNotification = require("react-native-push-notification");

// * Consts

// * Switches


// * Functions

const isMainScreen = screenId =>
  R.pipe(
    R.values,
    R.reject(R.propEq("screen", "CaptureScreen")),
    R.reject(R.propEq("screen", "NotesScreen")),
    R.findIndex(R.propEq("screen", screenId)),
    R.gt(R.__, -1)
  )(navigationStacks);

// * Navigator

class NavigationActionsClass {

  setNavigator(navigator) {
    this.navigator = navigator
  }

  push = (params) => this.navigator && this.navigator.push(params)
  handleDeepLink = (params) => this.navigator && this.navigator.handleDeepLink(params)
  popScreens = ({nodeId, fileId}) => this.navigator && this.navigator.handleDeepLink({
    link: 'popScreens',
    payload: {
      nodeId,
      fileId
    }
  })
  pop = (params) => this.navigator && this.navigator.pop(params)
  resetTo = (params) => this.navigator && this.navigator.resetTo(params)
  showSnackbar = (msg) => this.navigator && this.navigator.showSnackbar({
    text: msg,
    textColor: Colors.bg, // optional
    backgroundColor: Colors.primary, // optional
    duration: "short" // default is `short`. Available options: short, long, indefinite
  })
}

export let NavigationActions = new NavigationActionsClass()

// * Styling

// styling your navigator
// check out docs here:
// https://wix.github.io/react-native-navigation/#/styling-the-navigator
const navigatorStyle = {};

// * Icons

// https://oblador.github.io/react-native-vector-icons/

const icons = {
  "ios-git-network": {
    size: 30
  },
  "ios-glasses-outline": {
    size: 30
  },
  "ios-bulb-outline": {
    size: 30
  },
  "ios-grid-outline": {
    size: 30
  },
  "ios-menu": {
    size: 30
  },
  "ios-add": {
    size: 50
  },
  "ios-refresh": {
    size: 50
  },
  "ios-remove": {
    size: 30
  },
  "ios-navigate-outline": {
    size: 30
  },
  "ios-download-outline": {
    size: 50
  },
  "ios-flag-outline": {
    size: 30
  },
  "ios-arrow-round-down": {
    size: 30
  },
  "ios-arrow-round-up": {
    size: 30
  },
  "ios-radio-button-on": {
    size: 30
  },
  "ios-checkmark-circle-outline": {
    size: 30
  },
  "ios-remove-circle-outline": {
    size: 30
  },
  "ios-paper-outline": {
    size: 30
  }, // 16
  "ios-time-outline": {
    size: 30
  },
  "ios-construct-outline": {
    size: 30
  },
  "ios-color-wand-outline": {
    size: 30
  },
  "ios-trending-up-outline": {
    size: 30
  },
  "ios-trash-outline": {
    size: 30
  },
  "ios-arrow-round-back": {
    size: 30
  }, // 22
  "ios-arrow-round-forward": {
    size: 30
  }, // 22
  "ios-reorder": {
    size: 30
  }, // 22
  "ios-add-circle-outline": {
    size: 30
  }, // 25
  "md-arrow-back": {
    size: 30
  },
  "ios-calendar-outline": {
    size: 30
  },
  "ios-menu-outline": {
    size: 30
  },
  "ios-attach": {
    size: 30
  },
  "ios-close": {
    size: 30
  },//30
};

// * Screens and Tabs

const screens = {
  OrgFileBrowserScreen,
  OrgFilesScreen,
  SearchResultsScreen,
  SearchScreen,
  CaptureScreen,
  NotesScreen,
  OrgNodeEditScreen,
  AgendaScreen,
  DevScreen,
  "orgAssistant.Drawer": Drawer,
  OrgFileBrowserNavBar,
};

const navigationStacks = {
  search: {
    label: "Search",
    screen: `SearchScreen`,
    title: "Search",
    navigatorStyle
  },

  notes: {
    label: "Notes",
    screen: "NotesScreen",
    title: "Notes"
  },

  agenda: {
    label: "Agenda",
    screen: "AgendaScreen",
    title: "Week agenda",
    navigatorStyle
  },

  capture: {
    label: "Capture",
    screen: `CaptureScreen`,
    title: "Capture",
    navigatorStyle: {
      ...navigatorStyle,
      tabBarHidden: true
      // statusBarHidden: true
    }
  }
};

const fabGlobalStyles = {
  collapsedIconColor: Colors.base3,
  backgroundColor: Colors.primary
};

const createCaptureOngoingNotification = val =>
  PushNotification.localNotification({
    id: "0", // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
    // ticker: "External Mind", // (optional)
    // autoCancel: false, // (optional) default: true
    // largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
    // smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
    // bigText: "Select capture template", // (optional) default: "message" prop
    // subText: "This is a subText", // (optional) default: none
    // color: "red", // (optional) default: system default
    ongoing: true, // (optional) set whether this is an "ongoing" notification
    title: "Organic", // (optional)
    message: "Tap to create a new note", // (required)
    vibrate: false,
    playSound: false
  });

// * Screens Wrapper

const navigatorStyles = {
  OrgFileBrowserScreen: {
    // navBarComponentAlignment: "fill",
    // navBarHideOnScroll: true,
    ...NavigatorStyleDupa,
    navBarHidden: true,
    drawUnderNavBar: true,
    drawUnderTabBar: false
    // navBarTranslucent: true // make the nav bar semi-translucent, works best with drawUnderNavBar:true
    // navBarTransparent: true
    // navBarButtonColor: Colors.white,
    // navBarBackgroundColor: Colors.cyan,
    // statusBarColor: Colors.cyan
  }
};

const navigatorButtons = (icons, defaultStyles) => ({
  OrgFileBrowserScreen: {
    fab: {
      collapsedId: "addHeadline",
      collapsedIcon: icons[5],
      ...defaultStyles.fab
    },

    leftButtons: [
      {
        id: "dismissMenu",
        showAsAction: "always",
        icon: icons[26]
      }
    ],
    rightButtons: EditActionButtons(icons)
  }
});
function withSubscription(WrappedComponent, loadedIcons, store, id) {
  let localNavigatorButtons = {};

  if (R.propIs(Function, "createNavigatorButtons", WrappedComponent)) {
    localNavigatorButtons = WrappedComponent.createNavigatorButtons(
      loadedIcons,
      {
        fab: fabGlobalStyles
      }
    );
  }

  return class extends React.Component {
    static navigatorStyle = {
      ...WrappedComponent.navigatorStyle,
      ...navigatorStyles[id]
    };

    static navigatorButtons = {
      ...localNavigatorButtons,
      ...navigatorButtons(loadedIcons, { fab: fabGlobalStyles })[id]
    };

    constructor(props) {
      super(props);
      this._unregisterListeners = this.props.navigator.addOnNavigatorEvent(
        this.onNavigatorEvent.bind(this)
      );
      this.backHandler = null;
      // console.tron.log(WrappedComponent.navigatorStyle)
    }

    onNavigatorEvent = event => {
      const { navigationStack } = this.props;
      switch (event.type) {
        case "ScreenChangedEvent":
          switch (event.id) {
            case "willAppear":
              // BackHandler.addEventListener("hardwareBackPress", this.goBack);
              // console.tron.warn(this.props)
              store.dispatch({
                type: "SCREEN_WILL_APPEAR",
                id: this.props.screenInstanceID
              });

              // console.tron.warn(isMainScreen(this.props.testID));

              if (isMainScreen(this.props.testID)) {
                // console.tron.log(this.wrappedComponent && this.wrappedComponent.props)
                // store.dispatch(OrgDataRedux.resetStack(this.props.testID));
                this.backHandler = BackHandler.addEventListener(
                  "hardwareBackPress",
                  () => {
                    return true;
                  }
                );
              }
              break;

            case "willDisappear":
              // console.tron.log(this.props.testID);

              if (isMainScreen(this.props.testID)) {
                try {
                  this.backHandler.remove();
                  // console.tron.log("remover");
                } catch (err) {
                } finally {
                }
              }
              break;
          }
          break;

        // case "NavBarButtonPress":
        //   // const node = this.props.loadedNodesData[this.props.nodeId];
        //   break;

        case "DeepLink":
          const [route, ...rest] = event.link.split("/");

          /* ------------- Generic Links ------------- */

          if (route==='popScreens') {
            if (event.payload.nodeId && this.props.nodeId === event.payload.nodeId) {
              this.props.navigator.pop()
            }
            return
          }

          /* ------------- Screens Links ------------- */

          if (navigationStacks[route].screen !== id) return;

          /* ------------- Dispath Navigation Stack Change ------------- */
          // TODO do not dispatch in case if stack is not changed
          store.dispatch({
            type: "NAVIGATION_STACK_CHANGED",
            to: route
          });
          this.props.navigator.switchToTab();

          /* ------------- Dispath Routes ------------- */

          switch (route) {
            case "search":
              if (rest[0] === "run") {
                this.props.navigator.push({
                  screen: "SearchResultsScreen",
                  title: "Search results",
                  subtitle: "unsaved",
                  passProps: {
                    searchQuery: event.payload,
                    navigationStack: "searchResults"
                  }
                });
              }
              break;

            case "notes":
              /* ------------- Notes Route ------------- */

              const [fileId, nodeId] = rest;
              let navProps;
              // console.tron.log(fileId);

              if (!nodeId && fileId) {
                /* ------------- Open TOC ------------- */

                navProps = {
                  screen: "OrgFileBrowserScreen",
                  sharedElements: ["FileId" + fileId],
                  navigatorStyle: {
                    screenBackgroundColor: "transparent"
                  },
                  passProps: {
                    fileId,
                    foldingLevel: 1,
                    contentFoldingLevel: 1,
                    navigationStack: "notes"
                  }
                };
              } else if (nodeId) {
                /* ------------- Open Regular Notes Link ------------- */

                navProps = {
                  screen: "OrgFileBrowserScreen",
                  animationType: "slide-horizontal",
                  passProps: {
                    fileId,
                    nodeId,
                    foldingLevel: 1,
                    contentFoldingLevel: 1,
                    navigationStack: "notes"
                  }
                };
              }

              navProps && this.props.navigator.push(navProps);
              break;
            default:
          }

          break;
      }

      if (event.id === "bottomTabSelected") {
        store.dispatch({
          type: "NAVIGATION_STACK_CHANGED",
          to: R.keys(navigationStacks)[event.selectedTabIndex]
        });
      }
    };

    onNotification = notification => {
      // console.tron.log("NOTIFICATION:", notification);
      // console.tron.log(notification);
      createCaptureOngoingNotification();
      this.props.navigator.handleDeepLink({
        link: "capture",
        payload: { type: "capture" }
      });
    };

    componentDidMount() {
      // ... that takes care of the subscription...

      if (this.props.testID === "CaptureScreen") {
        PushNotification.configure({
          onRegister: function(token) {
            // console.tron.log("dupap");
          },
          onNotification: this.onNotification

          // (required) Called when a remote or local notification is opened or received
        });

        createCaptureOngoingNotification();
      }
    }

    componentWillUnmount() {
      this._unregisterListeners();
    }

    render() {
      // console.tron.log("render wrapper ");
      // console.tron.log(this.props);
      return (
        <WrappedComponent
          ref={view => this.wrappedComponent}
          icons={loadedIcons}
          {...this.props}
          backHandler={this.backHandler}
        />
      );
    }
  };
}

// * Register Components

const registerNavigationComponents = async (store, Provider) => {
  const loadedIcons = await loadIcons(Icon, icons);

  const registerNavigationComponent = (id, screen) => {
    switch (id) {
      case "OrgFileBrowserNavBar":
        Navigation.registerComponent(id, () => screen, store, Provider);
        break;
      default:
        Navigation.registerComponent(
          id,
          () =>
            gestureHandlerRootHOC(
              withSubscription(screen, loadedIcons, store, id)
            ),
          // withSubscription(screen, loadedIcons, store, id),
          store,
          Provider
        );
    }
  };

  R.pipe(R.toPairs, R.forEach(args => registerNavigationComponent(...args)))(
    screens
  );
};

// * Configuration

const configureNavigation = () =>
  loadIcons(Icon, icons).then(sources => {
    navigationStacks.notes.icon = sources[0];
    navigationStacks.agenda.icon = sources[3];
    navigationStacks.search.icon = sources[1];
    navigationStacks.capture.icon = sources[25];

    const appConfig = {
      tabs: R.values(navigationStacks),

      appStyle: {
        tabBarButtonColor: Colors.menuButton, // optional, change the color of the tab icons and text (also unselected). On Android, add this to appStyle
        tabBarSelectedButtonColor: Colors.primary,
        tabBarBackgroundColor: Colors.bg,
        initialTabIndex: 1 // optional, the default selected bottom tab. Default: 0. On Android, add this to appStyle
      },

      drawer: {
        left: {
          screen: `orgAssistant.Drawer`
        }
      }
    };

    if (settings.showDevScreen) {
      appConfig.tabs.push({
        label: "DEV",
        screen: "DevScreen",
        icon: sources[4],
        title: "DevScreen",
        navigatorStyle
      });
      appConfig.appStyle.initialTabIndex = 4;
    }

    Navigation.startTabBasedApp(appConfig);
  });

// * Navigation Helpers

export const navigateToDay = (day) => {
  vibrate()
  NavigationActions.navigator.handleDeepLink({
    link: 'agenda',
    payload: {
      day
    }
  })
};


export const addOrgElement = (navigator, payload) => {
  navigator.handleDeepLink({
    link: `capture/visitedNode`,
    payload
  });
};

export const showEditModal = (navigator, passProps) => {
  navigator.showLightBox({
    screen: "OrgNodeEditScreen",
    passProps: {
      ...passProps,
      asModal: true,
      dismissAction: () => {
        navigator.dismissLightBox();
        // if (passProps.onExit) passProps.onExit();
      }
    },
    style: {
      tapBackgroundToDismiss: true, // dismisses LightBox on background taps (optional)
      backgroundBlur: "xlight", // 'dark' / 'light' / 'xlight' / 'none' - the type of blur on the background
      backgroundColor: "rgba(0, 0, 0, 0.65)" // backgroundColor: '#ff000080', // tint color for the background, you can specify alpha here (optional)
    }
  });
};

export const navigateToOrgElement = (
  navigator,
  fileId,
  nodeId,
  navigationStack
) => {
  vibrate();
  // InteractionManager.runAfterInteractions(() => {

  navigator.handleDeepLink({
    link: `${navigationStack}/${fileId}` + (nodeId ? "/" + nodeId : "")
  });
  // InteractionManager.runAfterInteractions(() => {
  //   this.props.openFileRequest(this.props.fileId);
  // });

  // })
};

// * Exports

export { registerNavigationComponents, configureNavigation };
