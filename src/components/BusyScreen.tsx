// * BusyScreen.tsx

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
import { ActivityIndicator, Text, View } from 'react-native';
import { Colors } from '../themes';
import styles from './styles/BusyScreenStyles';

// ** Shape

interface BusyScreenProps {
  isBusy: boolean;
  message?: string;
  children: any;
}

// ** Component

const BusyScreen: React.StatelessComponent<BusyScreenProps> = ({
  isBusy,
  children,
  message = 'loading...',
}) => {
  if (!isBusy) return children;
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.magenta} />
      <Text style={styles.titleText}>{message}</Text>
    </View>
  );
};

// * Exports

export default BusyScreen;
