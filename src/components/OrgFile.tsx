// * OrgFile.tsx

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
import { Text, TouchableOpacity, View } from 'react-native';
import { SharedElementTransition } from 'react-native-navigation';
import { getFileTitle } from '../funcs';
import { Message } from './Message';
import styles from '../screens/styles/OrgFilesScreenStyles';
import { PlainOrgFile } from 'org-mode-connection';

// ** Shape

interface OrgFileProps {
  file: PlainOrgFile;
  onPress: () => void;
  onLongPress: () => void;
}

// ** Helpers

const createFileMessages = ({
  path,
  lastSync,
  mtime,
  isChanged,
}: {
  path: string;
  lastSync: string;
  mtime: string;
  isChanged: boolean;
}) => {
  const mtimeFromNow = moment(mtime).fromNow();
  let messages = [
    {
      text: path ? mtimeFromNow : 'Local',
      type: 'info',
    },
  ];
  if (!path) return [];
  const hasRemoteChanges = mtime > lastSync;
  isChanged &&
    (messages = [
      {
        text: 'Local changes',
        type: 'warning',
      },
    ]);
  hasRemoteChanges &&
    (messages = [
      {
        text: 'Remote changes',
        type: 'warning',
      },
    ]);
  isChanged &&
    hasRemoteChanges &&
    (messages = [
      {
        text: 'Local and remote changes. Must resolve manually.',
        type: 'error',
      },
    ]);
  return messages;
};

// ** Component

export const OrgFile = ({ file, onPress, onLongPress }: OrgFileProps) => {
  const fileName = getFileTitle(file);
  const messages = createFileMessages(file);
  // const fileSize = formatBytes(file.size);
  return (
    <TouchableOpacity
      style={[styles.item]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <SharedElementTransition sharedElementId={'FileId' + file.id}>
        <Text style={styles.itemTitle}>{fileName}</Text>
      </SharedElementTransition>
      <View style={styles.fileStatus}>
        {messages.map((message) => <Message key={message.text} {...message} />)}
      </View>
    </TouchableOpacity>
  );
};
