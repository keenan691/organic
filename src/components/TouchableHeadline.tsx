// * TouchableHeadline.tsx

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
import { Text } from 'react-native';
import OrgContent from './OrgContent';
import styles from '../containers/styles/OrgNodesListStyles';
import { Todo } from './Todo';
import { Priority } from './Priority';
import { Tags } from './Tags';

// ** Shape

interface TouchableHeadlineProps {
  baseLevel: number;
  flat: boolean;
  headline: string;
  level: number;
  onHeadlineContentPress: () => void;
  onPriorityPress: () => void;
  onTagsLongPress: () => void;
  onTagsPress: () => void;
  onTodoPress: () => void;
  priority: string;
  role?: 'visited';
  style: object;
  tags: string[];
  todo: string;
}

// ** Component

export const TouchableHeadline = (props: TouchableHeadlineProps) => {
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
    <Text>
      <Text
        onPress={props.onTodoPress}
        style={[headlineStyle, props.style || {}]}
      >
        <Todo todo={props.todo} />
      </Text>
      <Text
        onPress={props.onPriorityPress}
        style={[headlineStyle, props.style || {}]}
      >
        <Priority priority={props.priority} />
      </Text>
      <Text
        onPress={props.onHeadlineContentPress}
        style={[headlineStyle, props.style || {}]}
      >
        <OrgContent content={props.headline} asHeadline={true} />
      </Text>

      <Text
        onPress={props.onTagsPress}
        onLongPress={props.onTagsLongPress}
        style={[headlineStyle, props.style || {}]}
      >
        <Tags data={props.tags} />
      </Text>
    </Text>
  );
};
