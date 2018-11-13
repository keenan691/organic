import { Button, FlatList, Switch, Text, View } from "react-native";
import PropTypes from "prop-types";
import R from "ramda";
import React from "react";

import { Colors } from "../themes";
import { deepCompareItem } from './HOCs';
import styles from "./styles/OrgWidgetsStyles";

// * Functions

const splitItems = (rowsNum, items) => R.splitEvery(rowsNum)(items);

// * ThreeStatesButton

const valuesColors = {
  "-1": Colors.red,
  1: Colors.green,
  0: Colors.lightGray
};

const nextValue = val => (val === 1 ? -1 : val + 1);

const ThreeStatesButton = deepCompareItem(({ item: [key, value], onPress }) => {
  return (
    <View style={styles.threeStatesSwitch}>
      <Button
        color={valuesColors[value]}
        title={key}
        onPress={() => onPress(key, nextValue(value))}
      />
    </View>
  );
});

ThreeStatesButton.propTypes = {
  item: PropTypes.array.isRequired,
  onPress: PropTypes.func.isRequired
};

// * ThreeStatesSelectDialog

const ThreeStatesSelectDialog = ({ label, items, rowsNum, onItemPress }) => {
  if (items.length === 0) return <Text style={styles.emptyItem}>No tags found.</Text>

  const maxItemsInOneRow = 4;
  let preparedItems;
  let renderItem;
  const useButtonGroups = items.length > maxItemsInOneRow;

  // If there is more items - render it in rows
  if (useButtonGroups) {
    preparedItems = splitItems(rowsNum, items);
    renderItem = ({ item }) => (
      <View>
        {item.map(extractedItem => (
          <ThreeStatesButton
            key={extractedItem[0]}
            item={extractedItem}
            onPress={onItemPress}
          />
        ))}
      </View>
    );
  } else {
    preparedItems = items;
    renderItem = ({ item }) => (
      <ThreeStatesButton item={item} onPress={onItemPress} />
    );
  }

  return (
    <View style={styles.section}>
      <FlatList
        style={styles.threeStatesSelectDialog}
        horizontal
        data={preparedItems}
        keyExtractor={item => {
          let key
          if (useButtonGroups) {
            key = item.reduce((acc, val) => acc + val, '')
          } else {
            key = item[0]
          }
          return key
        }}
        renderItem={renderItem}
        />
    </View>
  );
};

ThreeStatesSelectDialog.propTypes = {
  items: PropTypes.array.isRequired,
  rowsNum: PropTypes.number.isRequired,
};

// * OrgSwitch

const OrgSwitch = props => {
  return (
      <Switch onValueChange={props.onItemPress} value={props.value} />
  );
};

OrgSwitch.propTypes = {
  onItemPress: PropTypes.func.isRequired,
  value: PropTypes.bool.isRequired,
};

// * OrgWidgets

const OrgWidgets = {
  ThreeStatesSelectDialog,
  OrgSwitch
};

export default OrgWidgets;
