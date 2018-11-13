// * SearchSavedScreen starts here
// * Imports

import {
  FlatList,
  SectionList,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";
import PropTypes from "prop-types";
import R, { props } from "ramda";
import React, { Component } from "react";

import { Fonts } from '../themes';
import OrgSearcherFilterRedux, {
  SearchFilterSelectors
} from "../redux/OrgSearcherFilterRedux";
import OrgSearcherRedux from "../redux/OrgSearcherRedux";
import Section, { SectionTitle } from '../components/Section';
import SectionListHeader from '../components/SectionListHeader';
import Separator from '../components/Separator';
import styles from "./styles/SearchSavedScreenStyles";

// * Screen

class SearchSavedScreen extends Component {
  renderItem = ({ item }) => {
    return (
      <View styles={styles.itemContainer}>
        <TouchableOpacity
          onLongPress={() => this.props.showActions(item)}
          onPress={() => {
            this.props.loadSearchQuery(item);
            this.props.navigator.push({
              screen: "SearchResultsScreen",
              title: "Search results",
              subtitle: item.name,
              passProps: {
                searchQuery: item,
                navigationStack: "searchResults"
              }
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
        keyExtractor={item => item.id}
        ItemSeparatorComponent={Separator}
        ListHeaderComponent={() => <SectionListHeader title="Saved searches"/>}
      />
    );
  }
}

// * PropTypes

SearchSavedScreen.propTypes = {};

// * Redux

const mapStateToProps = R.applySpec({
  savedItems: SearchFilterSelectors.savedItems
});

const mapDispatchToProps = {
  loadSearchQuery: OrgSearcherFilterRedux.loadSearchQuery,
  showActions: OrgSearcherRedux.showSavedSearchesActions
};

// * Export

export default connect(mapStateToProps, mapDispatchToProps)(SearchSavedScreen);
