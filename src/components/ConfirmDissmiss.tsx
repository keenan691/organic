// * ConfirmDissmiss.tsx

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

import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ConfirmContext } from '../screens/CaptureScreen';
import styles from '../screens/styles/CaptureScreenStyles';

// FIXME Schould not import context from CaptureScreen

// ** Component

export const ConfirmDissmiss = () => {
  return (
    <ConfirmContext.Consumer>
      {({ onConfirm, onDissmiss, canConfirm, onSave }) => (
        <View
          style={{
            flexDirection: 'row',
          }}
        >
          <TouchableOpacity onPress={onDissmiss}>
            <Icon
              size={30}
              name="ios-close-circle"
              style={styles.confirmDissmissButton}
            />
          </TouchableOpacity>

          <TouchableOpacity disabled={!canConfirm} onPress={onConfirm}>
            <Icon
              size={30}
              style={
                canConfirm
                  ? styles.confirmDissmissButton
                  : styles.confirmDissmissButtonDisabled
              }
              name="ios-checkmark-circle"
            />
          </TouchableOpacity>
        </View>
      )}
    </ConfirmContext.Consumer>
  );
};
