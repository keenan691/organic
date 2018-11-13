// * SearchSavedScreen.tsx

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
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import SectionListHeader from '../components/SectionListHeader';
import Separator from '../components/Separator';
import OrgSearcherFilterRedux, {
  SearchFilterSelectors,
} from '../redux/OrgSearcherFilterRedux';
import OrgSearcherRedux from '../redux/OrgSearcherRedux';
import styles from './styles/SearchSavedScreenStyles';

// ** Shape
// ** Screen

class SearchSavedScreen extends Component {
  renderItem = ({ item }) => {
    return (
      <View styles={styles.itemContainer}>
        <TouchableOpacity
          onLongPress={() => this.props.showActions({ item })}
          onPress={() => {
            this.props.loadSearchQuery({ query: item });
            this.props.navigator.push({
              screen: 'SearchResultsScreen',
              title: 'Search results',
              subtitle: item.name,
              passProps: {
                searchQuery: item,
                navigationStack: 'searchResults',
              },
            });
          }}
        >
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.name}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <FlatList
        initialNumToRender={15}
        data={this.props.savedItems}
        renderItem={this.renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={Separator}
        ListHeaderComponent={() => <SectionListHeader title="Saved searches" />}
      />
    );
  }
}

// ** Redux

const mapStateToProps = R.applySpec({
  savedItems: SearchFilterSelectors.savedItems,
});

const mapDispatchToProps = {
  loadSearchQuery: OrgSearcherFilterRedux.loadSearchQuery,
  showActions: OrgSearcherRedux.showSavedSearchesActions,
};

// * Export

export default connect(mapStateToProps, mapDispatchToProps)(SearchSavedScreen);
