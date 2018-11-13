// * TasksSummary.tsx

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
import { ProgressBarAndroid, View } from 'react-native';
import { Colors } from '../themes';
import styles from '../screens/styles/OrgFileBrowserScreenStyles';
import { PlainOrgNodesDict } from 'org-mode-connection';

// ** Shape

interface Props {
  nodesIds: string[];
  data: PlainOrgNodesDict;
}

// ** Component

export const TasksSummary = ({ nodesIds, data }: Props) => {
  const tasksIds = nodesIds.filter((id) => data[id].todo !== null);
  const doneTasksIds = tasksIds.filter((id) => data[id].todo === 'DONE');
  const progress = doneTasksIds.length / tasksIds.length;
  if (tasksIds.length === 0) {
    return null;
  }
  return (
    <View style={styles.container}>
      <View style={{}}>
        <ProgressBarAndroid
          styleAttr="Horizontal"
          color={Colors.green}
          indeterminate={false}
          progress={progress}
        />
      </View>
    </View>
  );
};
