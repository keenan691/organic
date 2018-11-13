import { Image, View, Text } from 'react-native'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import R from 'ramda';
import React from 'react';
import styles from './Styles/PlacesScreenStyles'
import { Images } from '../Themes';

const PlacesScreen = (props) => (
  <View style={styles.container}>
    <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
    <Text style={styles.titleText}>PlacesScreen Component</Text>
  </View>
)

const mapStateToProps = R.applySpec({
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(PlacesScreen)
