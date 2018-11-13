import { ActivityIndicator, Text, View } from "react-native";
import PropTypes from "prop-types";
import R from "ramda";
import React from "react";

import { Colors } from "../themes";
import styles from "./styles/BusyScreenStyles";

const BusyScreen = props =>
  props.isBusy ? (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.magenta} />
      <Text style={styles.titleText}>{props.message}</Text>
    </View>
  ) : (
    props.children
  );

BusyScreen.propTypes = {
  message: PropTypes.string
};

BusyScreen.defaultProps = {
  message: "loading..."
};

export default BusyScreen;
