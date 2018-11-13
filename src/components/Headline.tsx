// * Headline.tsx

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
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import OrgContent from './OrgContent';
import { Priority } from './Priority';
import styles from '../containers/styles/OrgNodesListStyles';
import { Tags } from './Tags';
import { Todo } from './Todo';

// ** Shape

interface HeadlineProps {
  baseLevel: number;
  flat: boolean;
  headline: string;
  level: number;
  priority: string;
  role?: 'visited';
  selectable: boolean;
  showEllipsis: boolean;
  style: object;
  tags: string[];
  todo: string;
}

// ** Component

export const Headline = (props: HeadlineProps) => {
  const baseLevel = props.baseLevel || 1;
  const levelMargin = props.flat ? 0 : 28 * (props.level - baseLevel);
  const headlineStyle = [
    styles[`h${props.level}`],
    { marginLeft: levelMargin },
  ];
  switch (props.role) {
    case 'visited':
      headlineStyle.push(styles.visitedHeadline);
      break;
  }
  return (
    <View
      style={{
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
      }}
    >
      <View style={{ width: '90%' }}>
        <Text
          selectable={props.selectable}
          style={[headlineStyle, props.style || {}]}
        >
          <Todo todo={props.todo} />
          <Priority priority={props.priority} />
          <OrgContent content={props.headline} asHeadline={true} />
          <Tags data={props.tags} />
        </Text>
      </View>
      <View>
        {props.showEllipsis && (
          <Icon style={headlineStyle} name="ios-arrow-forward" />
        )}
      </View>
    </View>
  );
};
