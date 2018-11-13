// * AgendaTodayDisplay.tsx

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
import { Text, View } from 'react-native';
import styles from '../containers/styles/OrgNodesListStyles';

// ** Shape

interface AgendaTodayDisplayProps {
  node: {
    date: string;
    dateWithTime: boolean;
    type: 'closed' | 'scheduled' | 'deadline';
    todo: string;
    warningPeriod: number;
  };
}

// ** Component

export const AgendaTodayDisplay = ({ node }: AgendaTodayDisplayProps) => {
  const date = moment(node.date);
  const formattedDate =
    date.format('YYYY-DD-MM') + node.dateWithTime
      ? ' ' + moment(node.date).format('HH:mm')
      : '';
  return (
    <View style={{ flexDirection: 'row' }}>
      {node.type === 'closed' && (
        <Text style={styles.agendaDisplay}>Closed {formattedDate}</Text>
      )}
      {node.type === 'scheduled' &&
        node.todo != 'DONE' && (
          <Text style={styles.agendaDisplay}>
            <Text>
              Scheduled{node.warningPeriod > 0
                ? ' ' + node.warningPeriod + 'x'
                : ''}
            </Text>
          </Text>
        )}
      {node.type === 'deadline' &&
        node.todo != 'DONE' && (
          <Text style={styles.agendaDisplay}>
            {' '}
            Deadline in {-node.warningPeriod} days
          </Text>
        )}
    </View>
  );
};
