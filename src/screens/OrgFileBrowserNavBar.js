// * OrgFileBrowserNavBar starts here
// * Imports

import {
  SectionList,
  Slider,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";
import PropTypes from "prop-types";
import R, { props } from "ramda";
import React, { Component } from "react";

import { Colors } from "../themes";
import { shadeBlend } from '../utils/functions';
import OrgDataRedux, { OrgDataSelectors } from "../redux/OrgDataRedux";
import Switch from "../components/Switch";
import styles from "./styles/OrgFileBrowserNavBarStyles";

// * Screen

//   <TouchableOpacity onPress={this.props.cycleMode}>
//   <View style={styles.modeContainer}>
//   <Text style={styles.modeValue}>
//   {this.props.mode.toUpperCase()}
// </Text>
//   <Text style={styles.modeLabel}>MODE</Text>
//   </View>
//   </TouchableOpacity>
class OrgFileBrowserNavBar extends Component {
  render() {
    const minLevel = 1;
    const maxLevel = 5;
    return (
      <View style={styles.container}>
        <View style={{ flex: 3 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{color: Colors.menuButton}}>Details: </Text>
            <Slider
              value={this.props.foldingLevel}
              step={1}
              minimumValue={minLevel}
              maximumValue={maxLevel}
              thumbTintColor={Colors.menuButton}
              minimumTrackTintColor={Colors.menuButton}
              maximumTrackTintColor={Colors.menuButton}
              style={{ width: "60%" }}
              onSlidingComplete={val => this.props.setFoldingLevel(val)}
              />
          </View>
        </View>
        <Switch
          iconName="ios-funnel"
          label="Sink"
          onPress={this.props.markAsSink}
          active={this.props.isSink}
        />
        {!this.props.hideMark && <Switch
          iconName="ios-bookmark"
          label="Mark"
          onPress={this.props.toggleMark}
          active={this.props.isPlaceMarked}
        />}
      </View>
    );
  }
}

// * PropTypes

OrgFileBrowserNavBar.propTypes = {};

// * Redux

const mapStateToProps = R.applySpec({
  isDataLoaded: OrgDataSelectors.isDataLoaded,
  // mode: OrgDataSelectors.getMode
});

const mapDispatchToProps = {
  // cycleMode: OrgDataRedux.cycleMode
};

// * Export

export default connect(mapStateToProps, mapDispatchToProps)(
  OrgFileBrowserNavBar
);
