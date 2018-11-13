// * SetClearWidget.tsx

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
import { Text, TouchableOpacity, View } from 'react-native';
import Separator from './Separator';
import styles from '../screens/styles/OrgNodeEditScreenStyles';

// ** Shape

interface SetClearWidgetProps {
  clearHandler?: (data: any) => void;
  data: any;
  dialog: (val: any, showDialog: (val: any) => void) => void;
  disabled: boolean;
  display: (val: any, data: any) => any;
  field: string;
  inTransform: (val: any, data: any) => any;
  label: string;
  outTransform: (data: any) => void;
  selectedValue: string;
  separator: boolean;
  setHandler: (data: any) => void;
}

// ** Component

export const SetClearWidget = ({
  clearHandler,
  data,
  dialog,
  disabled = false,
  display = R.identity,
  field,
  inTransform,
  label,
  outTransform,
  selectedValue,
  separator,
  setHandler,
}: SetClearWidgetProps) => {
  let currentVal = inTransform(R.propOr(selectedValue, field, data), data);
  const displayVal = R.isNil(data[field]) ? 'none' : display(data[field], data);
  return disabled ? null : (
    <View style={styles.subsectionContainer}>
      {separator && <Separator />}
      <Text>
        {label !== null ? <Text style={styles.label}>{label}: </Text> : null}
        <Text style={styles.value}>{displayVal}</Text>
      </Text>

      <View style={styles.modalActionsContainer}>
        <TouchableOpacity
          onPress={() =>
            clearHandler
              ? clearHandler(data)
              : R.pipe(R.assoc(field, undefined), setHandler)(data)
          }
        >
          <Text style={styles.sectionButtonText}>CLEAR</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            dialog(currentVal, (val) => {
              R.pipe(R.assoc(field, outTransform(val)), setHandler)(data);
            })
          }
        >
          <Text style={styles.sectionButtonText}>SET</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
