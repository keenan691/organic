import { Image, View, Text } from 'react-native'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import R from 'ramda';
import React from 'react';
import styles from './Styles/OrgAgendaStyles'
import { Images } from '../Themes';

const OrgAgenda = (props) => (
  <View style={styles.container}>
    <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
    <Text style={styles.titleText}>OrgAgenda Component</Text>
  </View>
)

const mapStateToProps = R.applySpec({
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(OrgAgenda)
