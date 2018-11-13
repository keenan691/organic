// * navigation.ts

// ** License

/**
 * Copyright (C) 2018, Bartłomiej Nankiewicz<bartlomiej.nankiewicz@gmail.com>
 *
 * This file is part of Organic.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// ** Tasks
// *** TODO Add types
// *** TODO Add tests
// *** TODO Refactor to smaller components
// - [ ] Outline
// - [ ] Extract
// *** TODO Review and doc withSubscription
// *** TODO Replace navigator prop to Global Navigator in all actions

// * Imports

import R from 'ramda';
import React from 'react';
import { BackHandler } from 'react-native';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import settings from '../settings';
import Drawer from './components/Drawer';
import { EditActionButtons } from './containers/OrgNodesList';
import NavigationRedux from './redux/NavigationRedux';
import AgendaScreen from './screens/AgendaScreen';
import CaptureScreen from './screens/CaptureScreen';
import DevScreen from './screens/DevScreen';
import NotesScreen from './screens/NotesScreen';
import OrgFileBrowserNavBar from "./containers/OrgFileBrowserNavBar";
import OrgFileBrowserScreen from './screens/OrgFileBrowserScreen';
import OrgFilesScreen from './screens/OrgFilesScreen';
import OrgNodeEditScreen from './screens/OrgNodeEditScreen';
import SearchResultsScreen from './screens/SearchResultsScreen';
import SearchScreen from './screens/SearchScreen';
import { Colors } from './themes';
import { NavigatorStyleDupa } from './themes/ApplicationStyles';
import loadIcons from './utils/loadIcons';
import { vibrate } from './vibrations';

var PushNotification = require('react-native-push-notification');

// * Helpers

const isMainScreen = (screenId) =>
  R.pipe(
    R.values,
    R.reject(R.propEq('screen', 'CaptureScreen')),
    R.reject(R.propEq('screen', 'NotesScreen')),
    R.findIndex(R.propEq('screen', screenId)),
    R.gt(R.__, -1),
  )(navigationStacks);

// * Global Navigator

class NavigationActionsClass {
  setNavigator(navigator) {
    this.navigator = navigator;
  }

  push = (params) => this.navigator && this.navigator.push(params);
  handleDeepLink = (params) =>
    this.navigator && this.navigator.handleDeepLink(params);
  popScreens = ({ nodeId, fileId }) =>
    this.navigator &&
    this.navigator.handleDeepLink({
      link: 'popScreens',
      payload: {
        nodeId,
        fileId,
      },
    });
  pop = (params) => this.navigator && this.navigator.pop(params);
  resetTo = (params) => this.navigator && this.navigator.resetTo(params);
  showSnackbar = (msg) =>
    this.navigator &&
    this.navigator.showSnackbar({
      text: msg,
      textColor: Colors.bg, // optional
      backgroundColor: Colors.primary, // optional
      duration: 'short', // default is `short`. Available options: short, long, indefinite
    });
}

export let NavigationActions = new NavigationActionsClass();
const navigatorStyle = {};

// * Icons

const icons = {
  'ios-git-network': {
    size: 30,
  },
  'ios-glasses-outline': {
    size: 30,
  },
  'ios-bulb-outline': {
    size: 30,
  },
  'ios-grid-outline': {
    size: 30,
  },
  'ios-menu': {
    size: 30,
  },
  'ios-add': {
    size: 50,
  },
  'ios-refresh': {
    size: 50,
  },
  'ios-remove': {
    size: 30,
  },
  'ios-navigate-outline': {
    size: 30,
  },
  'ios-download-outline': {
    size: 50,
  },
  'ios-flag-outline': {
    size: 30,
  },
  'ios-arrow-round-down': {
    size: 30,
  },
  'ios-arrow-round-up': {
    size: 30,
  },
  'ios-radio-button-on': {
    size: 30,
  },
  'ios-checkmark-circle-outline': {
    size: 30,
  },
  'ios-remove-circle-outline': {
    size: 30,
  },
  'ios-paper-outline': {
    size: 30,
  }, // 16
  'ios-time-outline': {
    size: 30,
  },
  'ios-construct-outline': {
    size: 30,
  },
  'ios-color-wand-outline': {
    size: 30,
  },
  'ios-trending-up-outline': {
    size: 30,
  },
  'ios-trash-outline': {
    size: 30,
  },
  'ios-arrow-round-back': {
    size: 30,
  }, // 22
  'ios-arrow-round-forward': {
    size: 30,
  }, // 22
  'ios-reorder': {
    size: 30,
  }, // 22
  'ios-add-circle-outline': {
    size: 30,
  }, // 25
  'md-arrow-back': {
    size: 30,
  },
  'ios-calendar-outline': {
    size: 30,
  },
  'ios-menu-outline': {
    size: 30,
  },
  'ios-attach': {
    size: 30,
  },
  'ios-close': {
    size: 30,
  }, //30
};

// * Screens

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
  'orgAssistant.Drawer': Drawer,
  OrgFileBrowserNavBar,
};

// * Tabs

const navigationStacks = {
  search: {
    label: 'Search',
    screen: `SearchScreen`,
    title: 'Search',
    navigatorStyle,
  },

  notes: {
    label: 'Notes',
    screen: 'NotesScreen',
    title: 'Notes',
  },

  agenda: {
    label: 'Agenda',
    screen: 'AgendaScreen',
    title: 'Week agenda',
    navigatorStyle,
  },

  capture: {
    label: 'Capture',
    screen: `CaptureScreen`,
    title: 'Capture',
    navigatorStyle: {
      ...navigatorStyle,
      tabBarHidden: true,
      // statusBarHidden: true
    },
  },
};

// * FAB global styles

const fabGlobalStyles = {
  collapsedIconColor: Colors.base3,
  backgroundColor: Colors.primary,
};

// * Capture notification

const createCaptureOngoingNotification = (val) =>
  PushNotification.localNotification({
    id: '0', // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
    ongoing: true, // (optional) set whether this is an "ongoing" notification
    title: 'Organic', // (optional)
    message: 'Tap to create a new note', // (required)
    vibrate: false,
    playSound: false,
  });

// * Screens Wrapper

const navigatorStyles = {
  OrgFileBrowserScreen: {
    ...NavigatorStyleDupa,
    navBarHidden: true,
    drawUnderNavBar: true,
    drawUnderTabBar: false,
  },
};

// * Navigator buttons

const navigatorButtons = (icons, defaultStyles) => ({
  OrgFileBrowserScreen: {
    fab: {
      collapsedId: 'addHeadline',
      collapsedIcon: icons[5],
      ...defaultStyles.fab,
    },

    leftButtons: [
      {
        id: 'dismissMenu',
        showAsAction: 'always',
        icon: icons[26],
      },
    ],
    rightButtons: EditActionButtons(icons),
  },
});

// * Subscripbe components

function withSubscription(WrappedComponent, loadedIcons, store, id) {
  let localNavigatorButtons = {};

  if (R.propIs(Function, 'createNavigatorButtons', WrappedComponent)) {
    localNavigatorButtons = WrappedComponent.createNavigatorButtons(
      loadedIcons,
      {
        fab: fabGlobalStyles,
      },
    );
  }

  return class extends React.Component {
    static navigatorStyle = {
      ...WrappedComponent.navigatorStyle,
      ...navigatorStyles[id],
    };

    static navigatorButtons = {
      ...localNavigatorButtons,
      ...navigatorButtons(loadedIcons, { fab: fabGlobalStyles })[id],
    };

    constructor(props) {
      super(props);
      this._unregisterListeners = this.props.navigator.addOnNavigatorEvent(
        this.onNavigatorEvent.bind(this),
      );
      this.backHandler = null;
    }

    onNavigatorEvent = (event) => {
      const { navigationStack } = this.props;
      switch (event.type) {
        case 'ScreenChangedEvent':
          switch (event.id) {
            case 'willAppear':
              store.dispatch(
                NavigationRedux.screenWillAppear({
                  id: this.props.screenInstanceID,
                }),
              );

              if (isMainScreen(this.props.testID)) {
                this.backHandler = BackHandler.addEventListener(
                  'hardwareBackPress',
                  () => {
                    return true;
                  },
                );
              }
              break;

            case 'willDisappear':
              if (isMainScreen(this.props.testID)) {
                try {
                  this.backHandler.remove();
                } catch (err) {
                } finally {
                }
              }
              break;
          }
          break;

        case 'DeepLink':
          const [route, ...rest] = event.link.split('/');

          /* ------------- Generic Links ------------- */

          if (route === 'popScreens') {
            if (
              event.payload.nodeId &&
              this.props.nodeId === event.payload.nodeId
            ) {
              this.props.navigator.pop();
            }
            return;
          }

          /* ------------- Screens Links ------------- */

          if (navigationStacks[route].screen !== id) {
            return;
          }

          /* ------------- Dispath Navigation Stack Change ------------- */
          // TODO do not dispatch in case if stack is not changed
          store.dispatch({
            type: 'NAVIGATION_STACK_CHANGED',
            to: route,
          });
          this.props.navigator.switchToTab();

          /* ------------- Dispath Routes ------------- */

          switch (route) {
            case 'search':
              if (rest[0] === 'run') {
                this.props.navigator.push({
                  screen: 'SearchResultsScreen',
                  title: 'Search results',
                  subtitle: 'unsaved',
                  passProps: {
                    searchQuery: event.payload,
                    navigationStack: 'searchResults',
                  },
                });
              }
              break;

            case 'notes':
              /* ------------- Notes Route ------------- */

              const [fileId, nodeId] = rest;
              let navProps;
              // console.tron.log(fileId);

              if (!nodeId && fileId) {
                /* ------------- Open TOC ------------- */

                navProps = {
                  screen: 'OrgFileBrowserScreen',
                  sharedElements: ['FileId' + fileId],
                  navigatorStyle: {
                    screenBackgroundColor: 'transparent',
                  },
                  passProps: {
                    fileId,
                    foldingLevel: 1,
                    contentFoldingLevel: 1,
                    navigationStack: 'notes',
                  },
                };
              } else if (nodeId) {
                /* ------------- Open Regular Notes Link ------------- */

                navProps = {
                  screen: 'OrgFileBrowserScreen',
                  animationType: 'slide-horizontal',
                  passProps: {
                    fileId,
                    nodeId,
                    foldingLevel: 1,
                    contentFoldingLevel: 1,
                    navigationStack: 'notes',
                  },
                };
              }

              navProps && this.props.navigator.push(navProps);
              break;
            default:
          }

          break;
      }

      if (event.id === 'bottomTabSelected') {
        store.dispatch({
          type: 'NAVIGATION_STACK_CHANGED',
          to: R.keys(navigationStacks)[event.selectedTabIndex],
        });
      }
    };

    onNotification = (notification) => {
      createCaptureOngoingNotification();
      this.props.navigator.handleDeepLink({
        link: 'capture',
        payload: { type: 'capture' },
      });
    };

    componentDidMount() {
      if (this.props.testID === 'CaptureScreen') {
        PushNotification.configure({
          onRegister: function(token) {},
          onNotification: this.onNotification,
        });

        createCaptureOngoingNotification();
      }
    }

    componentWillUnmount() {
      this._unregisterListeners();
    }

    render() {
      return (
        <WrappedComponent
          ref={(view) => this.wrappedComponent}
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
      case 'OrgFileBrowserNavBar':
        Navigation.registerComponent(id, () => screen, store, Provider);
        break;
      default:
        Navigation.registerComponent(
          id,
          () =>
            gestureHandlerRootHOC(
              withSubscription(screen, loadedIcons, store, id),
            ),
          store,
          Provider,
        );
    }
  };

  R.pipe(R.toPairs, R.forEach((args) => registerNavigationComponent(...args)))(
    screens,
  );
};

// * Configuration

const configureNavigation = () =>
  loadIcons(Icon, icons).then((sources) => {
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
        initialTabIndex: 1, // optional, the default selected bottom tab. Default: 0. On Android, add this to appStyle
      },

      drawer: {
        left: {
          screen: `orgAssistant.Drawer`,
        },
      },
    };

    if (settings.showDevScreen) {
      appConfig.tabs.push({
        label: 'DEV',
        screen: 'DevScreen',
        icon: sources[4],
        title: 'DevScreen',
        navigatorStyle,
      });
      appConfig.appStyle.initialTabIndex = 4;
    }

    Navigation.startTabBasedApp(appConfig);
  });

// * Navigation Helpers

export const navigateToDay = (day) => {
  vibrate();
  NavigationActions.navigator.handleDeepLink({
    link: 'agenda',
    payload: {
      day,
    },
  });
};

export const addOrgElement = (navigator, payload) => {
  navigator.handleDeepLink({
    link: `capture/visitedNode`,
    payload,
  });
};

export const showEditModal = (navigator, passProps) => {
  navigator.showLightBox({
    screen: 'OrgNodeEditScreen',
    passProps: {
      ...passProps,
      asModal: true,
      dismissAction: () => {
        navigator.dismissLightBox();
      },
    },
    style: {
      tapBackgroundToDismiss: true, // dismisses LightBox on background taps (optional)
      backgroundBlur: 'xlight', // 'dark' / 'light' / 'xlight' / 'none' - the type of blur on the background
      backgroundColor: 'rgba(0, 0, 0, 0.65)', // backgroundColor: '#ff000080', // tint color for the background, you can specify alpha here (optional)
    },
  });
};

export const navigateToOrgElement = (
  navigator,
  fileId,
  nodeId,
  navigationStack,
) => {
  vibrate();

  navigator.handleDeepLink({
    link: `${navigationStack}/${fileId}` + (nodeId ? '/' + nodeId : ''),
  });
};

// * Exports

export { registerNavigationComponents, configureNavigation };
