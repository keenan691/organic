// * OrgWidgets.tsx

// ** License

/**
 * Copyright (C) 2018, Bartłomiej Nankiewicz<bartlomiej.nankiewicz@gmail.com>
 *
 * This file is part of Organic.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// ** Imports

import R from 'ramda';
import React from 'react';
import { Button, FlatList, Switch, Text, View } from 'react-native';
import { Colors } from '../themes';
import { deepCompareItem } from '../utils/HOCs';
import styles from './styles/OrgWidgetsStyles';

// TODO Split and refactor this component

// ** Helpers

// ** Functions

const splitItems = (rowsNum: number, items: object[]) =>
  R.splitEvery(rowsNum)(items);

// ** ThreeStatesButton

const valuesColors = {
  '-1': Colors.red,
  1: Colors.green,
  0: Colors.lightGray,
};

const nextValue = (val: number) => (val === 1 ? -1 : val + 1);

interface ThreeStatesButtonProps {
  onPress: () => any;
  item: any;
}

const ThreeStatesButton: React.StatelessComponent<
  ThreeStatesButtonProps
> = deepCompareItem(({ item: [key, value], onPress }) => {
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

// ** ThreeStatesSelectDialog

interface ThreeStatesSelectDialogProps {
  items: any;
  rowsNum: number;
  onItemPress: () => void;
}

const ThreeStatesSelectDialog: React.StatelessComponent<
  ThreeStatesSelectDialogProps
> = ({ items, rowsNum, onItemPress }) => {
  if (items.length === 0) {
    return <Text style={styles.emptyItem}>No tags found.</Text>;
  }

  const maxItemsInOneRow = 4;
  let preparedItems;
  let renderItem;
  const useButtonGroups = items.length > maxItemsInOneRow;

  // If there is more items - render it in rows
  if (useButtonGroups) {
    preparedItems = splitItems(rowsNum, items);
    renderItem = ({ item }) => (
      <View>
        {item.map((extractedItem) => (
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
        horizontal={true}
        data={preparedItems}
        keyExtractor={(item) => {
          let key;
          if (useButtonGroups) {
            key = item.reduce((acc: string, val: string) => acc + val, '');
          } else {
            key = item[0];
          }
          return key;
        }}
        renderItem={renderItem}
      />
    </View>
  );
};

// ** OrgSwitch

interface OrgSwitchProps {
  onItemPress: () => any;
  value: any;
}

const OrgSwitch: React.StatelessComponent<OrgSwitchProps> = (props) => {
  return <Switch onValueChange={props.onItemPress} value={props.value} />;
};

// * OrgWidgets

const OrgWidgets = {
  ThreeStatesSelectDialog,
  OrgSwitch,
};

export default OrgWidgets;
