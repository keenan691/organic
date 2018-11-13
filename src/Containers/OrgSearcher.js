import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import R from 'ramda';
import React from 'react';

import { Colors } from '../Themes';
import BusyScreen from '../Components/BusyScreen';
import FullButton from '../Components/FullButton';
import OrgDataRedux from '../redux/OrgDataRedux';
import OrgNode, { OrgSearchResult } from '../Components/OrgNode';
import OrgSearcherFilterRedux, {
  SearchFilterSelectors,
} from '../redux/OrgSearcherFilterRedux';
import OrgSearcherRedux, {
  OrgSearcherSelectors,
} from '../redux/OrgSearcherRedux';
import OrgWidgets from '../Components/OrgWidgets';
import styles from './Styles/OrgSearcherStyles'

// * Components
// ** SearchTerm

const SearchTerm = (props) => {
  return (
    <View>
      <TextInput
        underlineColorAndroid={Colors.cyan}
        style={styles.label}
        placeholder="Enter searched phrase..."
        placeholderTextColor={Colors.base1}
        onSubmitEditing={(ev) => props.updateSearchQuery(['searchTerm'], ev.nativeEvent.text)}
      />
    </View>
  )
}

// ** SearchButton

const SearchButton = (props) => {
  const search = () => props.search(props.searchQuery);
  return (
    <FullButton text='search' onPress={search} />
  )
}

SearchButton.propTypes = {
  search: PropTypes.func.isRequired,
  searchQuery: PropTypes.object.isRequired,
}

// ** SearchResults

const SearchResults = (props) => {
  const results = (
    <FlatList
      initialNumToRender={10}
      data={props.searchResults}
      renderItem={({ item }) => <OrgSearchResult
                                   key={item.id}
                                   onPress={() => props.openSearchResult(item.fileID, item.id)}
                  {...item}
                                 />}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => (<View style={styles.separator}/>)}
      />
  )
  return (
    <View >
      <SearchStatus {...props} />
      { props.searching ? <BusyScreen message="searching..." /> : results }
    </View>
  )
}

SearchResults.propTypes = {
  searchResults: PropTypes.array.isRequired,
}

// ** SearchPanel

const SearchPanel = (props) =>  (
  <View style={styles.secondaryBackground}>
    <TouchableOpacity
      onPress={props.toggleSearchPanel}
      >
      <Icon name="close" style={styles.closeButton}/>
    </TouchableOpacity>
    <SearchTerm {...props} />
    <SearchFilters {...props} />
    <SearchButton {...props} />
  </View>
)


SearchPanel.propTypes = {
}

// ** SearchStatus

const SearchStatus = (props) => {
  return (
    <View style={[styles.secondaryBackground, {flexDirection: 'row', justifyContent: 'space-between'}]}>
      <Text style={styles.normalText}>{props.searchResults.length} items found.</Text>
      <TouchableOpacity onPress={props.toggleSearchPanel}>
        <Icon name="chevron-down" style={styles.closeButton} />
      </TouchableOpacity>
    </View>
  )
}

SearchStatus.propTypes = {

}

// * OrgSearcher

const OrgSearcher = (props) => (
  <View style={styles.container}>
    {props.showSearchPanel ? <SearchPanel {...props}/> : <SearchResults {...props}/>}
  </View>
)


OrgSearcher.propTypes = {
  searching: PropTypes.bool.isRequired,
}

const mapStateToProps = R.applySpec({
  searching: OrgSearcherSelectors.searching,
  searchResults: OrgSearcherSelectors.searchResults,
  searchQuery: SearchFilterSelectors.getQuery,
  showSearchPanel: SearchFilterSelectors.showSearchPanel
})

const mapDispatchToProps = {
  search: OrgSearcherRedux.search,
  openSearchResult: OrgDataRedux.openFileRequest,
  toggleSearchPanel: OrgSearcherFilterRedux.toggleSearchPanel,
  updateSearchQuery: OrgSearcherFilterRedux.updateSearchQuery,
}

export default connect(mapStateToProps, mapDispatchToProps)(OrgSearcher)
