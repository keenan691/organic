import { Switch as RSwitch, Text, TouchableOpacity, View } from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";
import React from "react";

import { Colors, Metrics } from '../themes';
import { shadeBlend } from '../utils/functions';

// import styles from './styles/SwitchStyles'
const INACTIVE_COLOR = Colors.menuButton
const ACTIVE_COLOR = Colors.primary;

const Switch = props => {
  const style = {
    color: props.active ? ACTIVE_COLOR : INACTIVE_COLOR
  };
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{
        marginLeft: Metrics.doubleBaseMargin,
        alignItems: "center"
      }}
    >
      <Icon style={style} size={20} name={props.iconName} />
      <Text style={style}>{props.label}</Text>
    </TouchableOpacity>
  );
};

export default Switch;
