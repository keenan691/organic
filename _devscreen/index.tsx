import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {connect} from 'react-redux';
import {iconsMap} from 'helpers/icons';
import {Drawer} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {devActions, devSelectors} from 'redux/dev';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

export const devScreens = {
  SourcesManager: require('./components/SourcesManager').default,
  Editor: require('./screens/main/Editor').default,
};

export function DevComponentChooser({componentId}) {
  const active = useSelector(devSelectors.getCurrentDevScreen);
  const dispatch = useDispatch();
  return (
    <View style={styles.page}>
      <Drawer.Section title="Select DevScreen:">
        {Object.keys(devScreens).map(name => (
          <Drawer.Item
            label={name}
            active={active === name}
            onPress={() => {
              Navigation.mergeOptions(componentId, {
                sideMenu: {left: {visible: false}},
              });
              dispatch(devActions.selectDevScreen(name));
            }}
          />
        ))}
      </Drawer.Section>
    </View>
  );
}

class DevScreen extends Component {
  static options(passProps) {
    return {
      topBar: {
        rightButtons: {
          id: 'buttonOne',
          text: 'select',
          icon: iconsMap['add-circle'],
        },
      },
    };
  }

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this); // <== Will be automatically unregistered when unmounted
  }

  navigationButtonPressed({buttonId}) {
    // will be called when "buttonOne" is clicked

    Navigation.mergeOptions(this.props.componentId, {
      sideMenu: {left: {visible: true}},
    });
  }

  render() {
    const {currentDevScreen, componentId} = this.props;
    const Component = devScreens[currentDevScreen];
    if (!Component) return null
    Navigation.mergeOptions(componentId, {
      topBar: {
        title: {
          text: 'DevScreen',
        },
        subtitle: {
          text: currentDevScreen,
        },
      },
    });
    return (
      <View style={styles.page}>
        <Component componentId={componentId} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 3,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
});

const mapStateToProps = state => ({
  currentDevScreen: devSelectors.getCurrentDevScreen(state),
});

export const DevComponent = gestureHandlerRootHOC(connect(mapStateToProps)(DevScreen));
