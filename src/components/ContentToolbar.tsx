// * ContentToolbar.tsx

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
import styles from '../screens/styles/CaptureScreenStyles';

// ** Component

export const ContentToolbar = () => {
  return (
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity>
        <Icon
          size={30}
          name="ios-checkbox-outline"
          style={styles.confirmDissmissButton}
        />
      </TouchableOpacity>
      <TouchableOpacity disabled={true}>
        <Icon size={30} name="ios-list" style={styles.confirmDissmissButton} />
      </TouchableOpacity>
    </View>
  );
};
