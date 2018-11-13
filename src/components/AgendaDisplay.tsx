// * AgendaDisplay.tsx

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
import { formatTimestamp, OrgNodesListItem } from '../containers/OrgNodesList';
import styles from '../containers/styles/OrgNodesListStyles';

// ** Shape

interface AgendaDisplayProps {
  node: OrgNodesListItem;
}

// ** Component

const AgendaDisplay:React.StatelessComponent<AgendaDisplayProps> = ({ node }) => {
  let scheduled = null;
  let deadline = null;
  node.timestamps.forEach((timestamp) => {
    switch (timestamp.type) {
      case 'scheduled':
        scheduled = formatTimestamp(timestamp);
        break;
      case 'deadline':
        deadline = formatTimestamp(timestamp);
        break;
    }
  });
  return (
    <View style={{ flexDirection: 'row' }}>
      {scheduled && (
        <Text style={styles.agendaDisplay}>
          <Text style={styles.label}>S:</Text> {scheduled}
        </Text>
      )}
      {deadline && (
        <Text style={styles.agendaDisplay}>
          <Text style={styles.label}> D:</Text> {deadline}
        </Text>
      )}
    </View>
  );
};

export default AgendaDisplay
