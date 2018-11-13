import {
  BackHandler,
  DeviceEventEmitter,
  Dimensions,
  InteractionManager,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import {
  Field,
  focus,
  formValues,
  getFormValues,
  reduxForm,
  registerField
} from 'redux-form';
import {
  TabView,
  TabBar,
  SceneMap,
  PagerAndroid,
  PagerExperimental
} from "react-native-tab-view";
import { compose, pure, withHandlers } from "recompose";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import Icon from "react-native-vector-icons/Ionicons";
import R from "ramda";
import React, { PureComponent, Component } from "react";

import {
  AgendaDisplayLong,
  BatchEditActionButtons,
  Headline,
  OrgNode
} from '../components/OrgNodesList';
import { Colors, Metrics } from "../themes";
import {
  NavigatorStyle,
  NavigatorStyleAlternative,
  NavigatorStyleDupa,
  NavigatorStyleMagenta
} from "../themes/ApplicationStyles";
import { captureTemplateFixtures } from "../fixtures";
import { safeGetId } from "../funcs";
import Breadcrumbs from "../components/Breadcrumbs";
import CaptureRedux, { CaptureSelectors } from "../redux/CaptureRedux";
import CaptureTemplates from "../components/CaptureTemplates";
import NavigationRedux, { NavigationSelectors } from "../redux/NavigationRedux";
import OrgContentStyles from '../components/styles/OrgContentStyles';
import OrgDataRedux, { OrgDataSelectors } from "../redux/OrgDataRedux";
import OrgNodeEditScreen from "./OrgNodeEditScreen";
import OrgNodeToolbar from "../components/OrgNodeToolbar";
import Section from "../components/Section";
import Separator from "../components/Separator";
import styles from "./styles/CaptureScreenStyles";

// * Forms
// ** HeadlineForm

const HeadlineForm = connect()(
  reduxForm({
    form: "capture"
  })(props => (
    <Field
      name="headline"
      component={CaptureTextInput}
      placeholder="Enter headline..."
      placeholderTextColor={Colors.menuButton}
      /* selectTextOnFocus */
      selectionColor={Colors.primary}
      returnKeyType="next"
      enablesReturnKeyAutomatically
      onSubmitEditing={() => props.dispatch(NavigationRedux.setCaptureRoute(2))}
      style={{
        color: Colors.menuButton,
        width: '100%',
        /* opacity: 0 */
      }}
    />
  ))
);

// ** ContentForm

const ContentForm = reduxForm({
  form: "capture"
})(props => (
  <Field
    name="content"
    component={CaptureTextInput}
    placeholder="Enter node content..."
    style={OrgContentStyles.regularLine}
    multiline={true}
    underlineColorAndroid={Colors.bg}
  />
));

// * Components
// ** Context

export const ConfirmContext = React.createContext({});

// ** Node Preview

const getBreadcrumbsNodes = createSelector(
  [R.prop("captureType"), R.prop("breadcrumbs")],
  (cType, breadcrumbs) => {
    if (cType === "edit") {
      breadcrumbsNodes = R.pipe(R.drop(1), R.dropLast(1))(breadcrumbs);
    } else {
      breadcrumbsNodes = R.drop(1, breadcrumbs);
    }
    return breadcrumbsNodes;
  }
);

const HeadlinePreview = connect(state => ({
  captureForm: getFormValues("capture")(state),
  breadcrumbs: NavigationSelectors.breadcrumbs(state),
  captureType: NavigationSelectors.getCaptureType(state)
}))(props => {
  let editedNodeLevel;
  if (props.captureType === "edit") {
    editedNodeLevel = props.breadcrumbs.length - 1;
    // breadcrumbsNodes = R.pipe(R.drop(1), R.dropLast(1))(props.breadcrumbs);
  } else {
    editedNodeLevel = props.breadcrumbs.length;
    // breadcrumbsNodes = R.drop(1, props.breadcrumbs);
  }
  const breadcrumbsNodes = getBreadcrumbsNodes(props);

  return (
    <View>
      {props.breadcrumbs.length > 0 && (
        <Breadcrumbs
          file={props.breadcrumbs[0].headline}
          nodes={breadcrumbsNodes}
        />
      )}
      {props.captureForm ? (
        <View>
          <Headline
            {...props.captureForm}
            level={editedNodeLevel}
            flat={true}
            selectable={true}
          />
          {props.captureForm.timestamps && (
            <AgendaDisplayLong linksDisabled node={props.captureForm} />
          )}
        </View>
      ) : null}
    </View>
  );
});

// ** Redux Autofocus TextInput

class ReduxTextInput extends PureComponent {
  shouldComponentUpdate(nextProps) {
    const { navigationStack } = nextProps;

    // Components traces navigation stack. Those fields only works in capture route
    if (navigationStack !== "capture") return false;
    // console.log('up')
    // // const editedNodeId = form.
    // if (nextProps.input.value) return true
    // console.tron.log()
    // console.tron.log(nextProps.input.value)
    return true;
  }

  componentDidUpdate(prevProps) {
    console.tron.log(this.props.values)
    const {
      captureRoute: { routes, index },
      input,
      isModalVisible,
      navigationStack
    } = this.props;

    // console.tron.log(this.input.setNativeProps)
    // console.tron.log(prevProps)
    // this.input.setNativeProps && this.input.setNativeProps({
    //   text: 'sdf'
    // });
	  // this.input.setNativeProps({
    //   text: 'huj'
    // });
    console.tron.log('UPDAAAAAAAA!!!!!!!!!!!!!!!!!!')
    // Stop if updated field don't belongs to current capture navigation route
    if (input.name !== routes[index].key) return;

    // const target = this.props.val.target;
    // const headline = this.props.val.headline;
    // console.tron.log(this.props.)
    if (this.timeoutUpdate) {
      clearTimeout(this.timeoutUpdate);
    }
    this.timeoutUpdate = setTimeout(() => {
      this.input.setNativeProps({
        text: this.props.input.value
      });
    }, 100);
    const prevIndex = prevProps.captureRoute.index;

    if (isModalVisible !== prevProps.isModalVisible) {
      // Focus on modal change
      isModalVisible ? this.input.blur() : this.input.focus();
    } else if (index !== prevIndex) {
      // Focus on capture route change
      this.input.focus();
    } else if (navigationStack != prevProps.navigationStack) {
      // Focus on main navigation stack change
      this.input.focus();
    }
  }

  render() {
    // console.tron.log("render text");
    const { input: { value, onChange, onBlur, onFocus }, ...rest } = this.props;
    return (
      <TextInput
        ref={view => (this.input = view)}
        onChangeText={onChange}
        blurOnSubmit={false}
        /* value={value} */
        onBlur={onBlur}
        onFocus={onFocus}
        {...rest}
      />
    );
  }
}

const CaptureTextInput = connect(
  R.applySpec({
    captureRoute: NavigationSelectors.getCaptureRoute,
    isModalVisible: NavigationSelectors.isModalVisible,
    navigationStack: OrgDataSelectors.getCurrentNavigationStack,
    nodes: OrgDataSelectors.getNodes,
    val: getFormValues('capture'),
  })
) (reduxForm({ form: "capture" })(ReduxTextInput))

// ** Content Toolbar

const ContentToolbar = props => {
  return (
    <View style={{ flexDirection: "row" }}>
      <TouchableOpacity>
        <Icon
          size={30}
          name="ios-checkbox-outline"
          style={styles.confirmDissmissButton}
        />
      </TouchableOpacity>
      <TouchableOpacity disabled>
        <Icon size={30} name="ios-list" style={styles.confirmDissmissButton} />
      </TouchableOpacity>
    </View>
  );
};

// ** Confirm Dissmiss

const ConfirmDissmiss = () => {
  return (
    <ConfirmContext.Consumer>
      {({ onConfirm, onDissmiss, canConfirm, onSave }) => (
        <View
          style={{
            flexDirection: "row"
          }}
        >
          <TouchableOpacity onPress={onDissmiss}>
            <Icon
              size={30}
              name="ios-close-circle"
              style={styles.confirmDissmissButton}
            />
          </TouchableOpacity>

          <TouchableOpacity disabled={!canConfirm} onPress={onConfirm}>
            <Icon
              size={30}
              style={
                canConfirm
                  ? styles.confirmDissmissButton
                  : styles.confirmDissmissButtonDisabled
              }
              name="ios-checkmark-circle"
            />
          </TouchableOpacity>
        </View>
      )}
    </ConfirmContext.Consumer>
  );
};
// * Tabs
// ** Headline EditTab

const NodeHeadlineTab = props => {
  return (
    <View style={[styles.container]}>
      <View
        style={{
          flex: 1,
          justifyContent: "space-between"
        }}
      >
        <View style={{ marginHorizontal: Metrics.doubleBaseMargin }}>
          <HeadlinePreview />
        </View>
        <View style={styles.inputContainer}>
          <View style={{ width: "60%"}}>
            <HeadlineForm />
          </View>
          <ConfirmDissmiss />
        </View>
      </View>
    </View>
  );
};

// ** Content Edit Tab

class NodeContentTab extends PureComponent {
  constructor(arg) {
    super(arg);
  }

  render() {
    console.tron.log("render content editor");
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column"
          // justifyContent: "space-between"
        }}
      >
        <View style={styles.contentFormContainer}>
          <ContentForm />
        </View>
        <View style={styles.inputContainer}>
          <ContentToolbar />
          <ConfirmDissmiss />
        </View>
      </View>
    );
  }

  focus() {
    //    this.field.getWrappedInstance().focus();
  }
}

// ** Capture Templates Tab

export const CaptureTemplatesTab = pure(props => {
  return (
    <View style={[styles.container]}>
      <CaptureTemplates />
    </View>
  );
});

// * Main

const initialLayout = {
  height: 0,
  width: Dimensions.get("window").width
};

class CaptureScreen extends Component {
  static navigatorStyle = {
    // navBarHidden: true,
    ...NavigatorStyleDupa,
    topBarElevationShadowEnabled: true,
    // navBarBackgroundColor: Colors.cyan,
    // statusBarColor: Colors.magenta
  };

  constructor(props) {
    super(props);
    this._unregisterNavigationEvents = this.props.navigator.addOnNavigatorEvent(
      this.onNavigatorEvent
    );

    this.props.dispatch(registerField("capture", "id", "Field"));
    this.props.dispatch(registerField("capture", "target", "Field"));
    this.props.dispatch(registerField("capture", "todo", "Field"));
    this.props.dispatch(registerField("capture", "timestamps", "Field"));
    this.props.dispatch(registerField("capture", "tags", "Field"));
    this.props.dispatch(registerField("capture", "priority", "Field"));
    this.props.dispatch(registerField("capture", "target", "Field"));
  }

  showCaptureTemplatesTab() {
    console.tron.log("SHOW CT TAB");
    // this.props.navigator.setStyle({
    //   navBarHidden: true, // make the nav bar hidden
    // });
    Keyboard.dismiss();

    // this.blur();
    this.props.setNavigationRoute(0);
    this.setCaptureTemplatesMenu();
  }

  showEditorTab = () => {
    this.props.setNavigationRoute(1);
  };

  showContentEditorTab = () => {
    this.props.setNavigationRoute(2);
  };

  setHeadlineEditMenu() {
    const headlineEditButtons = R.pipe(R.reject(R.propEq("id", "delete")))(
      BatchEditActionButtons(this.props.icons)
    );

    this.props.navigator.setButtons({
      rightButtons: headlineEditButtons,
      leftButtons: [
        {
          id: "showCaptureSideMenu",
          // showAsAction: "always",
          icon: this.props.icons[4]
        }
      ]
    });
    this.props.navigator.setStyle({

      navBarBackgroundColor: Colors.bg,
      navBarHidden: false
    });
  }

  setCaptureTemplatesMenu() {
    this.props.navigator.setButtons({
      rightButtons: [],
      leftButtons: []
    });
    this.props.navigator.setStyle({
      navBarHidden: true
    })
    // this.props.navigator.setStyle({
    //   navBarBackgroundColor: Colors.cyan
    // });
    // this.props.navigator.setSubTitle({
    //   subtitle: "dfs"
    // });
  }

  setContentEditorMenu() {
    // this.props.navigator.setButtons({
    //   rightButtons: [],
    //   leftButtons: []
    // });
    // this.props.navigator.setStyle({
    //   navBarBackgroundColor: Colors.editMenuColor
    // });

    // this.props.navigator.setSubTitle({
    //   subtitle: this.props.selectedCaptureTemplate
    // });

    this.props.navigator.setStyle({
      // navBarBackgroundColor: Colors.editMenuColor,
      navBarHidden: true,
    });
  }

  setup({ targetNode, targetFile, navigationStack = "capture", type }) {
    let target;
    let title;
    this.isConfirmed = false;
    this.type = type;
    this.props.navigator.switchToTab();
    // props.initialize is redux forms function
    this.props.setupCapture({
      captureType: type
    });

    title = "Capture";

    switch (type) {
      case "capture":
        this.showCaptureTemplatesTab();
        break;

      case "agendaCapture":
        this.showCaptureTemplatesTab();
        break;

      case "edit":
        title = "Edit";
        target = {
          nodeId: safeGetId(targetNode),
          fileId: targetNode.fileId,
          headline: targetNode && targetNode.headline
        };
        this.props.initialize({
          target,
          ...targetNode
        });
        this.props.loadBreadcrumbs(target);
        this.showEditorTab();
        break;

      case "addHeadline":
        title = "Add";
        target = {
          nodeId: safeGetId(targetNode),
          fileId: safeGetId(targetFile),
          headline: targetNode && targetNode.headline
        };
        this.props.initialize({
          target
        });

        this.props.loadBreadcrumbs(target);
        this.props.selectCaptureTemplate(null);
        this.showEditorTab();
        break;
    }

    this.props.navigator.setTitle({
      title
    });
    this.props.navigator.setSubTitle({
      subtitle: ""
    });
  }

  getNode() {
    const payload = {
      headline: "",
      level: 1,
      position: 0,
      content: "",
      tags: []
    };
    return payload;
  }

  saveAction = () => {
    this.onModalEnter();
    this.props.addCaptureTemplate(this.props.captureForm, this.onModalExit);
  };

  cancelAction = () => {
    this.isConfirmed = true;
    Keyboard.dismiss();
    setTimeout(() => this.props.cancel(this.props.navigator), 100);
  };

  confirmAction = () => {
    this.isConfirmed = true;
    Keyboard.dismiss();
    setTimeout(() => this.props.confirm(this.props.navigator), 100);
  };

  onKeyboardDidHide = () => {
    // BUG keyboard events are firing in number fo few at once
    // We have to take only one
    const now = new Date();
    // console.tron.log(this.props);
    if (!this.lastKeyboardEvent || now - this.lastKeyboardEvent > 1000) {
      this.props.isModalVisible === false &&
        !this.isConfirmed &&
        this.props.navigationState.index !== 0 &&
        this.goBack();
    }
    this.lastKeyboardEvent = now;
  };

  onNavigatorEvent = event => {
    // console.tron.log(event);
    switch (event.type) {
      case "ScreenChangedEvent":
        switch (event.id) {
          case "willAppear":
            Keyboard.addListener("keyboardDidHide", this.onKeyboardDidHide);
            BackHandler.addEventListener("hardwareBackPress", this.goBack);
            break;

          case "willDisappear":
            BackHandler.removeEventListener("hardwareBackPress", this.goBack);
            Keyboard.removeAllListeners("keyboardDidHide");
            break;
        }
        break;

      case "DeepLink":
        const res = event.link.split("/");
        const [route, target] = res;
        if (route !== "capture") return;
        this.setup(event.payload);
        break;

      case "NavBarButtonPress":
        event.id &&
          event.id !== "contextualMenuDismissed" &&
          this.props.runNodeAction(
            event.id,
            [],
            this.props.navigator,
            undefined, // Form will be loaded in sagas
            "capture",
            this.onModalExit,
            this.onModalEnter
          );
        break;
    }

    if (event.id === "bottomTabSelected") this.setup({ type: "capture" });
  };

  onModalEnter = () => {
    // this.blur();
    this.props.setModalState(true);
  };

  onModalExit = () => {
    // this.showEditorTab();
    // this.blur();

    // setTimeout(() => this.nodeEditView.focus(), 300);

    this.props.setModalState(false);
  };

  _handleIndexChange = index => {
    console.tron.log("IND CHANGE");
    const navigationState = { ...this.props.navigationState };
    navigationState.index = index;
    const routeKey = this.props.navigationState.routes[index].key;
    // this.setState({
    //   navigationState
    // });
    // this._handleRouteChange(routeKey)
  };

  _renderIcon = ({ route }) => (
    <Icon name={route.icon} size={30} style={styles.icon} />
  );

  _handleRouteChange = key => {
    switch (key) {
      case "templates":
        if (this.type === "capture") {
          this.showCaptureTemplatesTab();
        }
        break;

      case "headline":
        if (
          this.type === "capture" &&
          R.isNil(this.props.selectedCaptureTemplate)
        )
          break;

        this.showEditorTab();
        break;

      case "content":
        if (
          this.type === "capture" &&
          R.isNil(this.props.selectedCaptureTemplate)
        )
          break;
        this.showContentEditorTab();
        break;
    }
  };

  _renderHeader = props => (
    <TabBar
      {...props}
      // renderIcon={this._renderIcon}
      getLabelText={({ route }) => route.label}
      labelStyle={styles.tabBarLabel}
      style={styles.tabBar}
      onTabPress={({ route: { key } }) => {
        this._handleRouteChange(key);
      }}
      indicatorStyle={styles.indicatorStyle}
    />
  );

  goBack = () => {
    console.tron.log(this.type)
    if (["capture", "agendaCapture"].includes(this.type)) {
      if (this.props.navigationState.index === 0) {
        this.props.cancel(this.props.navigator);
      } else {
        this.showCaptureTemplatesTab();
      }
    } else if (this.type === "edit") {
      this.props.cancel(this.props.navigator);
    } else if (["addHeadline", "edit"].includes(this.type)) {

      switch (this.props.navigationState.index) {
      case 1:
        this.props.cancel(this.props.navigator);
        break;
      case 2:
        this.showEditorTab();
        break;
      }
    }
    return true;
  };

  blur() {}

  shouldComponentUpdate(nextProps, nextState) {
    let changed;
    changed =
      this.props.navigationState.index !== nextProps.navigationState.index ||
      this.props.canConfirm !== nextProps.canConfirm;
    return changed;
  }

  componentDidUpdate(prevProps, prevState) {
    // If capture template is selected show edit menu
    if (prevProps.navigationState.index != this.props.navigationState.index) {
      switch (this.props.navigationState.index) {
        case 1:
          this.setHeadlineEditMenu();

          break;
        case 2:
          this.setContentEditorMenu();
          break;
      }
    }

    // Set subtitle with selected capture template
    if (this.props.selectedCaptureTemplate) {
      this.props.navigator.setSubTitle({
        subtitle: this.props.selectedCaptureTemplate
      });
    }
  }

  // onCaptureTemplateSelected = id => {
  //   // this.showEditorTab();
  //   this.props.selectCaptureTemplate(id);
  //   this.props.navigator.setSubTitle({
  //     subtitle: R.find(R.propEq("name", id), this.props.captureTemplates).name
  //   });
  // };

  _renderPager = props => (
    // <PagerExperimental GestureHandler={GestureHandler} {...props} />
    <PagerAndroid
      {...props}
      keyboardDismissMode="none"
      animationEnabled={false}
    />
  );
  // shouldComponentUpdate(nextState, nextProps) {}
  render() {
    console.tron.log("renders capture");
    // console.tron.log(this.props);
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behaviour="padding"
        enabled
      >
        <ConfirmContext.Provider
          value={{
            canConfirm: this.props.canConfirm,
            onDissmiss: this.cancelAction,
            onConfirm: this.confirmAction,
            onSave: this.saveAction
          }}
        >
          <TabView
            tabBarPosition="bottom"
            navigationState={this.props.navigationState}
            // renderScene={this._renderScene}
            renderScene={SceneMap({
              templates: CaptureTemplatesTab,
              headline: NodeHeadlineTab,
              content: NodeContentTab
            })}
            // tabBarPosition="bottom"
            renderTabBar={this._renderHeader}
            renderPager={this._renderPager}
            onIndexChange={this._handleIndexChange}
            initialLayout={initialLayout}
            // useNativeDriver
            canJumpToTab={() => false}
            swipeEnabled={false}
          />
        </ConfirmContext.Provider>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  canConfirm: (() => {
    const values = getFormValues("capture")(state);
    return values && values.headline ? true : false;
  })(),
  captureTemplates: CaptureSelectors.captureTemplates(state),
  navigationState: NavigationSelectors.getCaptureRoute(state),
  isModalVisible: NavigationSelectors.isModalVisible(state),
  selectedCaptureTemplate: (() => {
    const values = getFormValues("capture")(state);
    return values && values.name;
  })()
});

const mapDispatchToProps = {
  selectCaptureTemplate: NavigationRedux.selectCaptureTemplateRequest,
  setNavigationRoute: NavigationRedux.setCaptureRoute,
  updateCaptureForm: CaptureRedux.updateCaptureForm,
  confirm: CaptureRedux.confirm,
  cancel: CaptureRedux.cancelCapture,
  addNode: OrgDataRedux.addNode,
  updateNode: OrgDataRedux.updateNode,
  addCaptureTemplate: CaptureRedux.addCaptureTemplateRequest,
  runNodeAction: OrgDataRedux.runNodeActionRequest,
  setModalState: NavigationRedux.setModalState,
  loadBreadcrumbs: NavigationRedux.loadBreadcrumbs,
  setupCapture: NavigationRedux.setupCapture
};

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({ form: "capture" })(CaptureScreen)
);
