// * SearchScreen.tsx

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
import { Dimensions, Keyboard, View } from 'react-native';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { connect } from 'react-redux';
import OrgDataRedux from '../redux/OrgDataRedux';
import OrgSearcherFilterRedux, {
  SearchFilterSelectors,
} from '../redux/OrgSearcherFilterRedux';
import { NavigatorStyleMagenta } from '../themes/ApplicationStyles';
import TabViewStyles from '../themes/TabViewStyles';
import SearchFilterScreen from './SearchFilterScreen';
import SearchSavedScreen from './SearchSavedScreen';
import styles from './styles/SearchScreenStyles';

// ** Shape
// ** Helpers

const NavigatorContext = React.createContext();

// ** Tabs

// *** SavedSearchesRoute

const SavedSearchesRoute = () => (
  <View style={[styles.container]}>
    <NavigatorContext.Consumer>
      {(props) => <SearchSavedScreen {...props} />}
    </NavigatorContext.Consumer>
  </View>
);

// *** FilterRoute

const FilterRoute = () => (
  <View style={[styles.container]}>
    <NavigatorContext.Consumer>
      {(props) => <SearchFilterScreen {...props} />}
    </NavigatorContext.Consumer>
  </View>
);

// ** Screen

class SearchScreen extends Component {
  static createNavigatorButtons = (icons, defaultStyles) => ({
    fab: {
      collapsedId: 'go',
      collapsedIcon: icons[8],
      ...defaultStyles.fab,
    },
  });

  static navigatorStyle = {
    ...NavigatorStyleMagenta,
    navBarHidden: true,
  };

  state = {
    index: 0,
    routes: [
      { key: 'filter', title: 'Query', icon: 'ios-flash' },
      { key: 'searches', title: 'Saved', icon: 'ios-list-box' },
      // { key: "marks", title: "Pinned", icon: "ios-pin" }
    ],
  };

  constructor(props) {
    super(props);
    this._unregisterListener = this.props.navigator.addOnNavigatorEvent(
      this.onNavigatorEvent.bind(this),
    );
  }

  _renderHeader = (props) => <TabBar {...props} {...TabViewStyles} />;

  componentWillUnmount() {
    this._unregisterListener();
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case 'willAppear':
        // Update screen if data was changed on other screens
        this.props.visitPlace(undefined, undefined, 'searchResults');
        break;
      case 'go':
        Keyboard.dismiss();
        if (this.props.isQueryEmpty) {
          break;
        }

        this.props.navigator.push({
          screen: 'SearchResultsScreen',
          title: 'Search results',
          subtitle: 'unsaved',
          passProps: {
            searchQuery: this.props.searchQuery,
            navigationStack: 'searchResults',
          },
        });
        break;

      case 'bottomTabReselected':
        if (this.state.index > 0) {
          this.setState((state) => ({ index: 0 }));
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
            filter: FilterRoute,
            // marks: PinnedRoute,
            searches: SavedSearchesRoute,
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
  searchQuery: SearchFilterSelectors.getQuery,
  isQueryEmpty: SearchFilterSelectors.isQueryEmpty,
});

const mapDispatchToProps = {
  visitPlace: OrgDataRedux.visitPlace,
  resetQuery: OrgSearcherFilterRedux.resetSearchFilter,
};

// * Export

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);
