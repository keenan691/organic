// * OrgSearchResult.tsx

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
import OrgContent from '../components/OrgContent';
import styles from './styles/OrgNodesListStyles';
import { Todo } from './Todo';
import { Priority } from './Priority';

// ** Shape

interface OrgSearchResultProps {
  content: string;
  headline: string;
  level: number;
  onPress: () => void;
  priority: string;
  todo: string;
}

// ** Component

export const OrgSearchResult = (props: OrgSearchResultProps) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Text style={styles[`h${props.level}`]}>
        <Todo todo={props.todo} />
        <Priority priority={props.priority} />
        <Text>
          <OrgContent content={props.headline} asHeadline={true} />
        </Text>
      </Text>
      {props.content ? (
        <Text style={styles.contentText}>{props.content}</Text>
      ) : null}
    </TouchableOpacity>
  );
};
