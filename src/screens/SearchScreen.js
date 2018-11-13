// * SearchScreen starts here
// * Imports

import {
  Dimensions,
  Keyboard,
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
import Icon from "react-native-vector-icons/Ionicons";
import PropTypes from "prop-types";
import R, { props } from "ramda";
import RNGRP from "react-native-get-real-path";
import React, { Component } from "react";

import { Colors } from "../themes";
import { EditActionButtons } from "../components/OrgNodesList";
import {
  NavigatorStyleAlternative,
  NavigatorStyleDupa,
  NavigatorStyleMagenta
} from "../themes/ApplicationStyles";
import { vibrate } from "../vibrations";
import OrgDataRedux from "../redux/OrgDataRedux";
import OrgFilesScreen from "./OrgFilesScreen";
import OrgSearcherFilterRedux, {
  SearchFilterSelectors
} from "../redux/OrgSearcherFilterRedux";
import PinnedScreen from "./PinnedScreen";
import SearchFilterScreen from "./SearchFilterScreen";
import SearchResultsScreen from "./SearchResultsScreen";
import SearchSavedScreen from "./SearchSavedScreen";
import TabViewStyles from '../themes/TabViewStyles';
import styles from "./styles/SearchScreenStyles";

const NavigatorContext = React.createContext();

// * Routes

const PinnedRoute = () => (
  <View style={[styles.container]}>
    <NavigatorContext.Consumer>
      {props => <PinnedScreen {...props} />}
    </NavigatorContext.Consumer>
  </View>
);

const SavedSearchesRoute = () => (
  <View style={[styles.container]}>
    <NavigatorContext.Consumer>
      {props => <SearchSavedScreen {...props} />}
    </NavigatorContext.Consumer>
  </View>
);

const FilterRoute = () => (
  <View style={[styles.container]}>
    <NavigatorContext.Consumer>
      {props => <SearchFilterScreen {...props} />}
    </NavigatorContext.Consumer>
  </View>
);

// * Screen

class SearchScreen extends Component {
  state = {
    index: 0,
    routes: [
      { key: "filter", title: "Query", icon: "ios-flash" },
      { key: "searches", title: "Saved", icon: "ios-list-box" }
      // { key: "marks", title: "Pinned", icon: "ios-pin" }
    ]
  };

  static navigatorStyle = {
    ...NavigatorStyleMagenta,
    navBarHidden: true
  };

  static createNavigatorButtons = (icons, defaultStyles) => ({
    fab: {
      collapsedId: "go",
      collapsedIcon: icons[8],
      ...defaultStyles.fab
    }
  });

  constructor(props) {
    super(props);
    this._unregisterListener = this.props.navigator.addOnNavigatorEvent(
      this.onNavigatorEvent.bind(this)
    );
  }

  componentWillUnmount() {
    this._unregisterListener();
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case "willAppear":
        // Update screen if data was changed on other screens
        this.props.visitPlace(undefined, undefined, "searchResults");
        break;
      case "go":
        Keyboard.dismiss();
        if (this.props.isQueryEmpty) break;

        this.props.navigator.push({
          screen: "SearchResultsScreen",
          title: "Search results",
          subtitle: "unsaved",
          passProps: {
            searchQuery: this.props.searchQuery,
            navigationStack: "searchResults"
          }
        });
        break;

      case "bottomTabReselected":
        if (this.state.index > 0) {
          this.setState(state => ({ index: 0 }));
        } else {
          if (!this.props.isQueryEmpty) {
            this.props.resetQuery();
          } else {
            // this.searchTerm.focus();
          }
        }
        break;

      default:
    }
  }

  _renderHeader = props => (
    <TabBar
      {...props}
      {...TabViewStyles}
    />
  );

  render() {
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
            filter: FilterRoute,
            // marks: PinnedRoute,
            searches: SavedSearchesRoute
          })}
          onIndexChange={index => this.setState({ index })}
          initialLayout={{ width: Dimensions.get("window").width }}
        />
      </NavigatorContext.Provider>
    );
  }
}

// * PropTypes

SearchScreen.propTypes = {};

// * Redux

const mapStateToProps = R.applySpec({
  searchQuery: SearchFilterSelectors.getQuery,
  isQueryEmpty: SearchFilterSelectors.isQueryEmpty
});

const mapDispatchToProps = {
  visitPlace: OrgDataRedux.visitPlace,
  resetQuery: OrgSearcherFilterRedux.resetSearchFilter
};

// * Export

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);
