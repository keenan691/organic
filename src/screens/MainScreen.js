import { Button, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import R from 'ramda';
import React, { Component } from 'react';

import OrgDataRedux, { OrgDataTypes } from '../redux/OrgDataRedux';
import styles from './styles/styles';

class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent);
  }

  _onNavigatorEvent = event => {
    console.log(event)
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'drawer') {
        this.props.navigator.toggleDrawer();
      }
    }
  };

  render() {
    console.log(this.props)
    return (
      <View style={styles.container}>
        <Text style={styles.bigText}>mmmMWWelcome to dEssential React Native!</Text>
        <Text style={styles.text}>
          dfddftThis is a boilerplatsdfesdf project for you to sdfget started quickly.
        </Text>
        <Button
          title="Pressssdf"
          onPress={() => this.props.testAction()}
          />
      </View>
    );
  }
}


const mapStateToProps = R.applySpec({

})

const mapDispatchToProps = {
  testAction: OrgDataRedux.clearDbRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen)
