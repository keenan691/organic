import React from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import styles from "./styles/SectionListHeaderStyles";

const SectionListHeader = ({ title, special }) => (
  <View >
    <Text
      style={[ special ? styles.specialText : styles.text]}
    >
      {title}
    </Text>
  </View>);

SectionListHeader.propTypes = {};

SectionListHeader.defaultProps = {};

export default SectionListHeader;
