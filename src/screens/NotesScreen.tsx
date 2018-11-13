// * NotesScreen.tsx

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

// ** Imports

import R from 'ramda';
import React, { Component } from 'react';
import { Dimensions, InteractionManager, Linking, View } from 'react-native';
import DialogAndroid from 'react-native-dialogs';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import settings from '../../settings';
import { EditActionButtons } from '../containers/OrgNodesList';
import { NavigationActions } from '../navigation';
import OrgDataRedux from '../redux/OrgDataRedux';
import StartupRedux, { StartupSelectors } from '../redux/StartupRedux';
import SyncRedux from '../redux/SyncRedux';
import { Colors } from '../themes';
import { NavigatorStyleDupa } from '../themes/ApplicationStyles';
import TabViewStyles from '../themes/TabViewStyles';
import { openDocumentPicker } from '../utils/pickers';
import CaptureTemplatesScreen from './CaptureTemplatesScreen';
import LastCapturedScreen from './LastCapturedScreen';
import OrgFilesScreen from './OrgFilesScreen';
import styles from './styles/NotesScreenStyles';

// * Shape
// ** Helpers

const NavigatorContext = React.createContext();

// ** Tabs
// *** FilesRoute

const FilesRoute = () => (
  <View style={[styles.container]}>
    <NavigatorContext.Consumer>
      {(props) => <OrgFilesScreen {...props} />}
    </NavigatorContext.Consumer>
  </View>
);

// *** CaptureTemplatesRoute

const CaptureTemplatesRoute = () => (
  <View style={[styles.container]}>
    <NavigatorContext.Consumer>
      {(props) => <CaptureTemplatesScreen {...props} />}
    </NavigatorContext.Consumer>
  </View>
);

// *** LastCapturedRoute

const LastCapturedRoute = () => (
  <View style={[styles.container]}>
    <NavigatorContext.Consumer>
      {(props) => <LastCapturedScreen {...props} />}
    </NavigatorContext.Consumer>
  </View>
);

// ** Screen

class NotesScreen extends Component {
  state = {
    index: 0,
    routes: [
      { key: 'files', title: 'Files', icon: 'logo-buffer' },
      { key: 'captureTemplates', title: 'Sinks', icon: 'ios-download' },
      { key: 'lastCaptured', title: 'Last Notes', icon: 'ios-pulse' },
    ],
  };

  static navigatorStyle = {
    ...NavigatorStyleDupa,
    navBarHidden: true,
    drawUnderNavBar: true,
    drawUnderTabBar: false,
  };

  static createNavigatorButtons = (icons, defaultStyles) => ({
    rightButtons: EditActionButtons(icons),

    fab: {
      collapsedId: 'go',
      collapsedIcon: icons[4],
      expendedIconColor: Colors.base3,
      expendedId: 'clear',
      expendedIcon: icons[30],
      ...defaultStyles.fab,
      actions: [
        {
          id: 'sync',
          icon: icons[6],
          iconColor: Colors.base3,
          backgroundColor: Colors.violet,
        },
        {
          id: 'import',
          icon: icons[9],
          iconColor: Colors.base3,
          backgroundColor: Colors.blue,
        },
        {
          id: 'add',
          icon: icons[5],
          iconColor: Colors.base3,
          backgroundColor: Colors.green,
        },
      ],
    },
  });

  constructor(props) {
    super(props);
    NavigationActions.setNavigator(props.navigator);
    this._removeEventListeners = this.props.navigator.addOnNavigatorEvent(
      this.onNavigatorEvent.bind(this),
    );
  }

  async showWelcomeMessage() {
    if (this.props.isPrivacyPolicyAgreed) {
      return;
    }
    let action = DialogAndroid.actionDismiss;
    const res = await DialogAndroid.alert(
      'Welcome to Organic',
      `Thanks for using my app.<br/><br/><a href="${
        settings.privacyPolicyUrl
      }">Privacy Policy</a><p>You must agree to my terms and privacy policy to use this app.</p>`,
      { contentIsHtml: true, cancelable: false, positiveText: 'I agree' },
    );
    action = res.action;
    this.props.agreePrivacyPolicy();
  }

  componentDidMount() {
    this.props.startup();
    this.props.updateExternallyChangedFiles();
    setInterval(
      () =>
        InteractionManager.runAfterInteractions(() => {
          try {
            this.props.updateExternallyChangedFiles();
          } catch (e) {}
        }),
      settings.checkExternalChangesInterval,
    );
    this.showWelcomeMessage();
  }

  componentWillUnmount() {
    this._removeEventListeners();
    Linking.removeEventListener('url', this.handleOpenURL);
  }

  onNavigatorEvent(event) {
    if (event.id && event.id === 'contextualMenuDismissed') {
      return;
    }
    switch (event.type) {
      case 'NavBarButtonPress':
        switch (event.id) {
          case 'drawer':
            this.props.navigator.toggleDrawer();
            break;
          case 'add':
            this.props.addNotebook();
            break;
          case 'import':
            openDocumentPicker(this.props.addFile)();
            break;
          case 'sync':
            this.props.sync();
            break;
        }
        break;

      case 'ScreenChangedEvent':
        switch (event.id) {
          case 'willAppear':
            // Update screen if data was changed on other screens
            this.props.visitPlace(
              this.props.fileId,
              this.props.nodeId,
              'notes',
            );
            break;
        }
        break;

      case 'DeepLink':
        break;
      default:
        switch (event.id) {
          case 'bottomTabReselected':
            this.setState((state) => ({ index: 0 }));
        }
    }
  }

  _renderIcon = ({ route }) => (
    <View
      style={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon name={route.icon} size={30} style={styles.icon} />
    </View>
  );

  _renderHeader = (props) => <TabBar {...props} {...TabViewStyles} />;

  render() {
    return (
      <NavigatorContext.Provider
        value={{
          navigator: this.props.navigator,
          icons: this.props.icons,
        }}
      >
        <TabView
          renderTabBar={this._renderHeader}
          navigationState={this.state}
          renderScene={SceneMap({
            files: FilesRoute,
            lastCaptured: LastCapturedRoute,
            captureTemplates: CaptureTemplatesRoute,
          })}
          onIndexChange={(index) => this.setState({ index })}
          initialLayout={{ width: Dimensions.get('window').width }}
        />
      </NavigatorContext.Provider>
    );
  }
}

// ** Redux

const mapStateToProps = R.applySpec({
  isPrivacyPolicyAgreed: StartupSelectors.isPrivacyPolicyAgreed,
});

const mapDispatchToProps = {
  addFile: OrgDataRedux.addOrgFileRequest,
  addNotebook: OrgDataRedux.addNotebookRequest,
  agreePrivacyPolicy: StartupRedux.agreePrivacyPolicy,
  clearDb: OrgDataRedux.clearDbRequest,
  removeFile: OrgDataRedux.removeOrgFileRequest,
  startup: StartupRedux.startup,
  sync: OrgDataRedux.syncAllFilesRequest,
  updateExternallyChangedFiles: SyncRedux.updateExternallyChangedFiles.request,
  visitPlace: OrgDataRedux.visitPlace,
};

// * Export

export default connect(mapStateToProps, mapDispatchToProps)(NotesScreen);
