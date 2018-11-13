import React from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import styles from "./styles/EmptyListStyles";

const EmptyList = ({ itemName, message }) => (
  <View style={styles.container}>
      <Text style={styles.header}>You have no {itemName}</Text>
      <Text style={styles.content}>{message}</Text>
  </View>
);

export default EmptyList;
