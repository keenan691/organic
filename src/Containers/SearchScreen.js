import { Image, View, Text } from 'react-native'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import R from 'ramda';
import React from 'react';

import { Images } from '../Themes';
import OrgAgenda from '../Components/OrgAgenda';
import OrgCapture from '../Components/OrgCapture';
import OrgQuickmarks from '../Components/OrgQuickmarks';
import OrgSearcher from '../Components/OrgSearcher';
import SearchButton from '../Components/SearchButton';
import SearchFilters from '../Components/SearchFilters';
import SearchQuery from '../Components/SearchQuery';
import SearchResults from '../Components/SearchResults';
import styles from './Styles/SearchScreenStyles'

// **** TODO Containers
// ***** SearchScreen
// OrgAgenda OrgCapture OrgQuickmarks
// **** TODO SearchRedux
//   - searchResults
//   - currentFilter
//   - tags
//   - todos
//   - phrase
//   - time
// **** TODO OrgFileSagas
// search
// **** TODO Functions
//   - make search query from redux state

const SearchScreen = (props) => (
  <View style={styles.container}>
    <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
    <Text style={styles.titleText}>SearchScreen Component</Text>
  </View>
)

const mapStateToProps = R.applySpec({
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen)
