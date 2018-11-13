import { Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import R from 'ramda';
import React from 'react';

import styles from './Styles/IconBarStyles'

// * IconButton

const IconButton = ({ iconName, actionHandler }) => (
  <View >
    <TouchableHighlight onPress={actionHandler} style={styles.iconButton}>
      <Icon style={styles.iconButtonText} name={iconName} />
    </TouchableHighlight>
  </View>
)

IconButton.propTypes = {
  iconName: PropTypes.string.isRequired,
  actionHandler: PropTypes.func.isRequired,
}

// * IconBar

const IconBar = ({ items }) => (
  <View style={styles.iconBar} >
    {items.map((item, index) => <IconButton key={index} {...item} />)}
  </View>
)

IconBar.propTypes = {
  items: PropTypes.array.isRequired,
}

export default IconBar
