// * Switch.tsx

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
import { Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors, Metrics } from '../themes';

// ** Shape

const INACTIVE_COLOR = Colors.menuButton;
const ACTIVE_COLOR = Colors.primary;

interface SwitchProps {
  iconName: string;
  label: string;
  active: boolean;
  onPress: () => void;
}

// ** Component

const Switch: React.StatelessComponent<SwitchProps> = (props) => {
  const style = {
    color: props.active ? ACTIVE_COLOR : INACTIVE_COLOR,
  };
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{
        marginLeft: Metrics.doubleBaseMargin,
        alignItems: 'center',
      }}
    >
      <Icon style={style} size={20} name={props.iconName} />
      <Text style={style}>{props.label}</Text>
    </TouchableOpacity>
  );
};

// * Exports

export default Switch;
