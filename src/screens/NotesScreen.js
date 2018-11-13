import {
  Dimensions,
  InteractionManager,
  Linking,
  Platform,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import {
  DocumentPicker,
  DocumentPickerUtil
} from "react-native-document-picker";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import { connect } from "react-redux";
import DialogAndroid from "react-native-dialogs";
import Icon from "react-native-vector-icons/Ionicons";
import PropTypes from "prop-types";
import R, { props } from "ramda";
import RNGRP from "react-native-get-real-path";
import React, { Component } from "react";

import { Colors, Metrics } from "../themes";
import { EditActionButtons } from "../components/OrgNodesList";
import { NavigationActions } from '../navigation';
import {
  NavigatorStyleAlternative,
  NavigatorStyleDupa
} from "../themes/ApplicationStyles";
import { vibrate } from "../vibrations";
import CaptureTemplatesScreen from "./CaptureTemplatesScreen";
import LastCapturedScreen from "./LastCapturedScreen";
import OrgDataRedux from "../redux/OrgDataRedux";
import OrgFilesScreen from "./OrgFilesScreen";
import PinnedScreen from "./PinnedScreen";
import SearchResultsScreen from "./SearchResultsScreen";
import StartupRedux, { StartupSelectors } from '../redux/StartupRedux';
import SyncRedux from "../redux/SyncRedux";
import TabViewStyles from '../themes/TabViewStyles';
import settings from '../../settings';
import styles from "./styles/NotesScreenStyles";

const NavigatorContext = React.createContext();

// * Document picker

// - [ ] check if type is 'application/octet-stream'
// - [ ] check fileName ends on org suffix
const validateFile = ({ type, fileName }) => type==='application/octet-stream' && /.org$/.test(fileName);

const openDocumentPicker = successHandler => () =>
  DocumentPicker.show(
    { filetype: [DocumentPickerUtil.allFiles()] },
    (error, res) => {
      if (res) {
        RNGRP.getRealPathFromURI(res.uri).then(
          path => {
            const isCorrectFile = !error && validateFile(res) ? successHandler(path) : null
            if (!isCorrectFile) {
              NavigationActions.showSnackbar("Chosen file is not 'org mode' type")
              return null
            }
            return true
          }
        );
      }
    }
  );

// * Routes

const FilesRoute = () => (
  <View style={[styles.container]}>
    <NavigatorContext.Consumer>
      {props => <OrgFilesScreen {...props} />}
    </NavigatorContext.Consumer>
  </View>
);

const CaptureTemplatesRoute = () => (
  <View style={[styles.container]}>
    <NavigatorContext.Consumer>
      {props => <CaptureTemplatesScreen {...props} />}
    </NavigatorContext.Consumer>
  </View>
);

const LastCapturedRoute = () => (
  <View style={[styles.container]}>
    <NavigatorContext.Consumer>
      {props => <LastCapturedScreen {...props} />}
    </NavigatorContext.Consumer>
  </View>
);

// * Screen

// ** Notes

class NotesScreen extends Component {
  // static navigatorStyle = {
  //   navBarHidden: true,
  //   ...NavigatorStyleDupa
  // };

  state = {
    index: 0,
    routes: [
      { key: "files", title: "Files", icon: "logo-buffer" },
      { key: "captureTemplates", title: "Sinks", icon: "ios-download" },
      { key: "lastCaptured", title: "Last Notes", icon: "ios-pulse" }
    ]
  };

  static navigatorStyle = {
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
  };

  static createNavigatorButtons = (icons, defaultStyles) => ({
    // leftButtons: [],

    rightButtons: EditActionButtons(icons),

    fab: {
      collapsedId: "go",
      collapsedIcon: icons[4],
      expendedIconColor: Colors.base3,
      expendedId: "clear",
      expendedIcon: icons[30],
      ...defaultStyles.fab,
      actions: [
        {
          id: "sync",
          icon: icons[6],
          iconColor: Colors.base3,
          backgroundColor: Colors.violet
        },
        {
          id: "import",
          icon: icons[9],
          iconColor: Colors.base3,
          backgroundColor: Colors.blue
        },
        {
          id: "add",
          icon: icons[5],
          iconColor: Colors.base3,
          backgroundColor: Colors.green
        }
      ]
    }
  });

  constructor(props) {
    super(props);
    NavigationActions.setNavigator(props.navigator)
    this._removeEventListeners = this.props.navigator.addOnNavigatorEvent(
      this.onNavigatorEvent.bind(this)
    );
  }

  async showWelcomeMessage ()  {
    if (this.props.isPrivacyPolicyAgreed) return
    let action = DialogAndroid.actionDismiss
    const res = await DialogAndroid.alert('Welcome to Organic', `Thanks for using my app.<br/><br/><a href="${settings.privacyPolicyUrl}">Privacy Policy</a><p>You must agree to my terms and privacy policy to use this app.</p>`, { contentIsHtml: true, cancelable: false, positiveText: 'I agree'})
      action = res.action
    this.props.agreePrivacyPolicy()
  }


  componentDidMount() {
    this.props.startup()
    this.props.updateExternallyChangedFiles();
    setInterval(
      () =>
        InteractionManager.runAfterInteractions(() => {
          try { this.props.updateExternallyChangedFiles() } catch (e) {}
        }),
      settings.checkExternalChangesInterval
    );
    this.showWelcomeMessage()


  }

  componentWillUnmount() {
    this._removeEventListeners();
    Linking.removeEventListener("url", this.handleOpenURL);
  }

  onNavigatorEvent(event) {
    if (event.id && (event.id === "contextualMenuDismissed")) return
    switch (event.type) {
      case "NavBarButtonPress":
        switch (event.id) {
          case "drawer":
            this.props.navigator.toggleDrawer();
            break;
          case "add":
            this.props.addNotebook();
            break;
          case "import":
            openDocumentPicker(this.props.addFile)();
            break;
          case "sync":
            this.props.sync();
            break;
        }
        break;

      case "ScreenChangedEvent":
        switch (event.id) {
          case "willAppear":
            // Update screen if data was changed on other screens
            this.props.visitPlace(
              this.props.fileId,
              this.props.nodeId,
              "notes"
            );
            break;
        }
        break;

      case "DeepLink":
        // const res = event.link.split("/");

        // const [route, fileId, nodeId] = res;
        // if (route !== "browser") return;

        // this.props.navigator.switchToTab(1);
        // if (!nodeId) return;

        // const props = {
        //   screen: "OrgFileBrowserScreen",
        //   passProps: {
        //     fileId,
        //     nodeId,
        //     foldingLevel: 1,
        //     contentFoldingLevel: 1,
        //     navigationStack: "browser"
        //   }
        // };

        // this.props.navigator.push(props);
        break;
      default:
        switch (event.id) {
          case "bottomTabReselected":
            this.setState(state => ({ index: 0 }));
        }
    }
  }
  // openTOC(fileId) {
  //   vibrate();
  //   this.props.loadToc(fileId, this.props.navigator);
  // }

  _renderIcon = ({ route }) => (
    <View
      style={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Icon name={route.icon} size={30} style={styles.icon} />
    </View>
  );

  _renderHeader = props => (
    <TabBar
      {...props}
      {...TabViewStyles}
    />
  );

  render() {
    console.tron.log("render notes");
    return (
      <NavigatorContext.Provider
        value={{
          navigator: this.props.navigator,
          icons: this.props.icons
        }}
      >
        <TabView
          renderTabBar={this._renderHeader}
          navigationState={this.state}
          renderScene={SceneMap({
            files: FilesRoute,
            lastCaptured: LastCapturedRoute,
            // marks: PinnedRoute,
            // searches: SavedSearchesRoute,
            captureTemplates: CaptureTemplatesRoute
          })}
          onIndexChange={index => this.setState({ index })}
          initialLayout={{ width: Dimensions.get("window").width }}
        />
      </NavigatorContext.Provider>
    );
  }
}

// * PropTypes

NotesScreen.propTypes = {};

// * Redux

const mapStateToProps = R.applySpec({
  isPrivacyPolicyAgreed: StartupSelectors.isPrivacyPolicyAgreed
});

const mapDispatchToProps = {
  // loadToc: OrgDataRedux.loadToc,
  agreePrivacyPolicy: StartupRedux.agreePrivacyPolicy,
  removeFile: OrgDataRedux.removeOrgFileRequest,
  clearDb: OrgDataRedux.clearDbRequest,
  sync: OrgDataRedux.syncAllFilesRequest,
  startup: StartupRedux.startup,
  addFile: OrgDataRedux.addOrgFileRequest,
  addNotebook: OrgDataRedux.addNotebookRequest,
  visitPlace: OrgDataRedux.visitPlace,
  addFile: OrgDataRedux.addOrgFileRequest,
  addNotebook: OrgDataRedux.addNotebookRequest,
  updateExternallyChangedFiles: SyncRedux.updateExternallyChangedFilesRequest
};

// * Export

export default connect(mapStateToProps, mapDispatchToProps)(NotesScreen);
