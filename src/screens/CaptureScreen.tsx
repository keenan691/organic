// * CaptureScreen.tsx

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
import React, { Component, PureComponent } from 'react';
import { BackHandler, Dimensions, Keyboard, KeyboardAvoidingView, View } from 'react-native';
import { PagerAndroid, SceneMap, TabBar, TabView } from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { pure } from 'recompose';
import { getFormValues, reduxForm, registerField } from 'redux-form';
import { ConfirmDissmiss } from '../components/ConfirmDissmiss';
import { ContentToolbar } from '../components/ContentToolbar';
import CaptureTemplates from '../containers/CaptureTemplates';
import { ContentForm } from '../containers/ContentForm';
import { HeadlineForm } from '../containers/HeadlineForm';
import { HeadlinePreview } from '../containers/HeadlinePreview';
import { BatchEditActionButtons } from '../containers/OrgNodesList';
import { safeGetId } from '../funcs';
import CaptureRedux, { CaptureSelectors } from '../redux/CaptureRedux';
import NavigationRedux, { NavigationSelectors } from '../redux/NavigationRedux';
import OrgDataRedux from '../redux/OrgDataRedux';
import { Colors, Metrics } from '../themes';
import { NavigatorStyleDupa } from '../themes/ApplicationStyles';
import styles from './styles/CaptureScreenStyles';

// ** Shape

// ** Helpers

export const ConfirmContext = React.createContext({});

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

// ** Tabs
// *** Headline EditTab

const NodeHeadlineTab = () => {
  return (
    <View style={[styles.container]}>
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <View style={{ marginHorizontal: Metrics.doubleBaseMargin }}>
          <HeadlinePreview />
        </View>
        <View style={styles.inputContainer}>
          <View style={{ width: '60%' }}>
            <HeadlineForm />
          </View>
          <ConfirmDissmiss />
        </View>
      </View>
    </View>
  );
};

// *** Content Edit Tab

class NodeContentTab extends PureComponent {
  constructor(arg) {
    super(arg);
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
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
}

// *** Capture Templates Tab

export const CaptureTemplatesTab = pure(() => {
  return (
    <View style={[styles.container]}>
      <CaptureTemplates />
    </View>
  );
});

// ** Screen

class CaptureScreen extends Component {
  static navigatorStyle = {
    ...NavigatorStyleDupa,
    topBarElevationShadowEnabled: true,
  };

  constructor(props) {
    super(props);
    this._unregisterNavigationEvents = this.props.navigator.addOnNavigatorEvent(
      this.onNavigatorEvent,
    );

    this.props.dispatch(registerField('capture', 'id', 'Field'));
    this.props.dispatch(registerField('capture', 'target', 'Field'));
    this.props.dispatch(registerField('capture', 'todo', 'Field'));
    this.props.dispatch(registerField('capture', 'timestamps', 'Field'));
    this.props.dispatch(registerField('capture', 'tags', 'Field'));
    this.props.dispatch(registerField('capture', 'priority', 'Field'));
    this.props.dispatch(registerField('capture', 'target', 'Field'));
  }

  showCaptureTemplatesTab() {
    Keyboard.dismiss();
    this.props.setNavigationRoute({ route: 0 });
    this.setCaptureTemplatesMenu();
  }

  showEditorTab = () => {
    this.props.setNavigationRoute({ route: 1 });
  };

  showContentEditorTab = () => {
    this.props.setNavigationRoute({ route: 2 });
  };

  setHeadlineEditMenu() {
    const headlineEditButtons = R.pipe(R.reject(R.propEq('id', 'delete')))(
      BatchEditActionButtons(this.props.icons),
    );

    this.props.navigator.setButtons({
      rightButtons: headlineEditButtons,
      leftButtons: [
        {
          id: 'showCaptureSideMenu',
          icon: this.props.icons[4],
        },
      ],
    });
    this.props.navigator.setStyle({
      navBarBackgroundColor: Colors.bg,
      navBarHidden: false,
    });
  }

  setCaptureTemplatesMenu() {
    this.props.navigator.setButtons({
      rightButtons: [],
      leftButtons: [],
    });
    this.props.navigator.setStyle({
      navBarHidden: true,
    });
  }

  setContentEditorMenu() {
    this.props.navigator.setStyle({
      navBarHidden: true,
    });
  }

  setup({ targetNode, targetFile, navigationStack = 'capture', type }) {
    let target;
    let title;
    this.isConfirmed = false;
    this.type = type;
    this.props.navigator.switchToTab();

    // props.initialize is redux forms function
    this.props.setupCapture({
      captureType: type,
    });

    title = 'Capture';

    switch (type) {
      case 'capture':
        this.showCaptureTemplatesTab();
        break;

      case 'agendaCapture':
        this.showCaptureTemplatesTab();
        break;

      case 'edit':
        title = 'Edit';
        target = {
          nodeId: safeGetId(targetNode),
          fileId: targetNode.fileId,
          headline: targetNode && targetNode.headline,
        };
        this.props.initialize({
          target,
          ...targetNode,
        });
        this.props.loadBreadcrumbs({ target });
        this.showEditorTab();
        break;

      case 'addHeadline':
        title = 'Add';
        target = {
          nodeId: safeGetId(targetNode),
          fileId: safeGetId(targetFile),
          headline: targetNode && targetNode.headline,
        };
        this.props.initialize({
          target,
        });

        this.props.loadBreadcrumbs({ target });
        this.props.selectCaptureTemplate({ id: null });
        this.showEditorTab();
        break;
    }

    this.props.navigator.setTitle({
      title,
    });

    this.props.navigator.setSubTitle({
      subtitle: '',
    });
  }

  getNode() {
    const payload = {
      headline: '',
      level: 1,
      position: 0,
      content: '',
      tags: [],
    };
    return payload;
  }

  saveAction = () => {
    this.onModalEnter();
    this.props.addCaptureTemplate({
      target: this.props.captureForm,
      after: this.onModalExit,
    });
  };

  cancelAction = () => {
    this.isConfirmed = true;
    Keyboard.dismiss();
    setTimeout(
      () => this.props.cancel({ navigator: this.props.navigator }),
      100,
    );
  };

  confirmAction = () => {
    this.isConfirmed = true;
    Keyboard.dismiss();
    setTimeout(
      () => this.props.confirm({ navigator: this.props.navigator }),
      100,
    );
  };

  onKeyboardDidHide = () => {
    // BUG keyboard events are firing in number fo few at once
    // We have to take only one
    const now = new Date();
    if (!this.lastKeyboardEvent || now - this.lastKeyboardEvent > 1000) {
      this.props.isModalVisible === false &&
        !this.isConfirmed &&
        this.props.navigationState.index !== 0 &&
        this.goBack();
    }
    this.lastKeyboardEvent = now;
  };

  onNavigatorEvent = (event) => {
    switch (event.type) {
      case 'ScreenChangedEvent':
        switch (event.id) {
          case 'willAppear':
            Keyboard.addListener('keyboardDidHide', this.onKeyboardDidHide);
            BackHandler.addEventListener('hardwareBackPress', this.goBack);
            break;

          case 'willDisappear':
            BackHandler.removeEventListener('hardwareBackPress', this.goBack);
            Keyboard.removeAllListeners('keyboardDidHide');
            break;
        }
        break;

      case 'DeepLink':
        const res = event.link.split('/');
        const [route, target] = res;
        if (route !== 'capture') {
          return;
        }
        this.setup(event.payload);
        break;

      case 'NavBarButtonPress':
        event.id &&
          event.id !== 'contextualMenuDismissed' &&
          this.props.runNodeAction(
            event.id,
            [],
            this.props.navigator,
            undefined, // Form will be loaded in sagas
            'capture',
            this.onModalExit,
            this.onModalEnter,
          );
        break;
    }

    if (event.id === 'bottomTabSelected') {
      this.setup({ type: 'capture' });
    }
  };

  onModalEnter = () => {
    this.props.setModalState({ visibility: true });
  };

  onModalExit = () => {
    this.props.setModalState({ visibility: false });
  };

  _handleIndexChange = (index) => {
    const navigationState = { ...this.props.navigationState };
    navigationState.index = index;
  };

  _renderIcon = ({ route }) => (
    <Icon name={route.icon} size={30} style={styles.icon} />
  );

  _handleRouteChange = (key) => {
    switch (key) {
      case 'templates':
        if (this.type === 'capture') {
          this.showCaptureTemplatesTab();
        }
        break;

      case 'headline':
        if (
          this.type === 'capture' &&
          R.isNil(this.props.selectedCaptureTemplate)
        ) {
          break;
        }

        this.showEditorTab();
        break;

      case 'content':
        if (
          this.type === 'capture' &&
          R.isNil(this.props.selectedCaptureTemplate)
        ) {
          break;
        }
        this.showContentEditorTab();
        break;
    }
  };

  _renderHeader = (props) => (
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
    if (['capture', 'agendaCapture'].includes(this.type)) {
      if (this.props.navigationState.index === 0) {
        this.props.cancel({ navigator: this.props.navigator });
      } else {
        this.showCaptureTemplatesTab();
      }
    } else if (this.type === 'edit') {
      this.props.cancel({ navigator: this.props.navigator });
    } else if (['addHeadline', 'edit'].includes(this.type)) {
      switch (this.props.navigationState.index) {
        case 1:
          this.props.cancel({ navigator: this.props.navigator });
          break;
        case 2:
          this.showEditorTab();
          break;
      }
    }
    return true;
  };

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
        subtitle: this.props.selectedCaptureTemplate,
      });
    }
  }

  _renderPager = (props) => (
    <PagerAndroid
      {...props}
      keyboardDismissMode="none"
      animationEnabled={false}
    />
  );

  render() {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behaviour="padding"
        enabled={true}
      >
        <ConfirmContext.Provider
          value={{
            canConfirm: this.props.canConfirm,
            onDissmiss: this.cancelAction,
            onConfirm: this.confirmAction,
            onSave: this.saveAction,
          }}
        >
          <TabView
            tabBarPosition="bottom"
            navigationState={this.props.navigationState}
            renderScene={SceneMap({
              templates: CaptureTemplatesTab,
              headline: NodeHeadlineTab,
              content: NodeContentTab,
            })}
            renderTabBar={this._renderHeader}
            renderPager={this._renderPager}
            onIndexChange={this._handleIndexChange}
            initialLayout={initialLayout}
            canJumpToTab={() => false}
            swipeEnabled={false}
          />
        </ConfirmContext.Provider>
      </KeyboardAvoidingView>
    );
  }
}

// ** Redux

const mapStateToProps = (state, ownProps) => ({
  canConfirm: (() => {
    const values = getFormValues('capture')(state);
    return values && values.headline ? true : false;
  })(),
  captureTemplates: CaptureSelectors.captureTemplates(state),
  navigationState: NavigationSelectors.getCaptureRoute(state),
  isModalVisible: NavigationSelectors.isModalVisible(state),
  selectedCaptureTemplate: (() => {
    const values = getFormValues('capture')(state);
    return values && values.name;
  })(),
});

const mapDispatchToProps = {
  addCaptureTemplate: CaptureRedux.addCaptureTemplate.request,
  addNode: OrgDataRedux.addNode,
  cancel: CaptureRedux.cancelCapture,
  confirm: CaptureRedux.confirm,
  loadBreadcrumbs: NavigationRedux.loadBreadcrumbs,
  runNodeAction: OrgDataRedux.runNodeActionRequest,
  selectCaptureTemplate: NavigationRedux.selectCaptureTemplateRequest,
  setModalState: NavigationRedux.setModalState,
  setNavigationRoute: NavigationRedux.setCaptureRoute,
  setupCapture: NavigationRedux.setupCapture,
  updateNode: OrgDataRedux.updateNode,
};

// * Exports

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({ form: 'capture' })(CaptureScreen),
);
