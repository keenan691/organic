/*
Your drawer component goes here
*/

import { StyleSheet, Platform, Dimensions, View, Text } from 'react-native';
import React, { Component } from 'react';

import PinnedScreen from '../screens/PinnedScreen';
import styles from './styles/drawerStyles';



export default class Drawer extends Component {
  render() {
    return <View style={styles.container} >
      <Text style={styles.titleText}>Marks</Text>
      <PinnedScreen navigator={this.props.navigator} />
      </View>;
  }
}
