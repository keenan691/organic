// * AgendaDisplayLong.tsx

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
import { Link } from './Link';
import { OrgNodesListItem } from '../containers/OrgNodesList';
import styles from '../containers/styles/OrgNodesListStyles';

// ** Shape

interface AgendaDisplayLongProps {
  node: OrgNodesListItem;
  linksDisabled: boolean;
}

// ** Component

export const AgendaDisplayLong = ({ node, linksDisabled }: AgendaDisplayLongProps) => {
  let scheduled;
  let deadline;
  let closed;
  node.timestamps.forEach((timestamp) => {
    switch (timestamp.type) {
      case 'scheduled':
        scheduled = timestamp;
        break;
      case 'deadline':
        deadline = timestamp;
        break;
      case 'closed':
        closed = timestamp;
        break;
    }
  });
  return (
    <View>
      {scheduled && (
        <Text style={styles.agendaDisplay}>
          <Text style={styles.label}>Scheduled:</Text>{' '}
          <Link disabled={linksDisabled} day={scheduled} />
        </Text>
      )}
      {deadline && (
        <Text style={styles.agendaDisplay}>
          <Text style={styles.label}>Deadline:</Text>{' '}
          <Link disabled={linksDisabled} day={deadline} />
        </Text>
      )}
      {closed && (
        <Text style={styles.agendaDisplay}>
          <Text style={styles.label}>Closed:</Text>{' '}
          <Link disabled={linksDisabled} day={closed} />
        </Text>
      )}
    </View>
  );
};
