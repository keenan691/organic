// * Link.tsx

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

import moment from 'moment';
import React from 'react';
import { Text, TextProperties } from 'react-native';
import { navigateToDay } from '../navigation';
import { formatTimestamp } from '../containers/OrgNodesList';
import styles from '../containers/styles/OrgNodesListStyles';
import { PlainOrgTimestamp } from 'org-mode-connection';

// ** Shape

interface LinkProps {
  day: PlainOrgTimestamp;
  disabled: boolean;
}

// ** Component

export const Link = ({ day, disabled }: LinkProps) => {
  const props: TextProperties = {
    style: styles.link,
  };
  if (!disabled) {
    props.onPress = () => navigateToDay(moment(day.date).format('YYYY-MM-DD'));
  }
  return <Text {...props}>{formatTimestamp(day)}</Text>;
};
