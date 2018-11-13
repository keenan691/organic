// * `(skeleton/buffer-name)` starts here
// * Imports

import { SectionList, Text, TouchableOpacity, View } from 'react-native';
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";
import PropTypes from "prop-types";
import R, { props } from "ramda";
import React, { Component } from "react";
// import styles from "./styles/`(skeleton/buffer-name)`Styles";

// * Screen

class `(skeleton/buffer-name)` extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  }

  onNavigatorEvent = (event) => {
    if (event.type === "ScreenChangedEvent") {
      switch (event.id) {
      case "didAppear":
      }
    }

    if (event.type === "NavBarButtonPress") {
      switch (event.id) {
      case "cancel":
        break;
      }
    }
  }

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  render() {
    return (
      <View>
        <Text>Screen</Text>
      </View>
    );
  }
}

// * PropTypes

`(skeleton/buffer-name)`.propTypes = {
};

// * Redux

const mapStateToProps = R.applySpec({
});

const mapDispatchToProps = {
};

// * Export

export default connect(mapStateToProps, mapDispatchToProps)(`(skeleton/buffer-name)`);
