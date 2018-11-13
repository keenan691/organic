// * TagsInput.tsx

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

import R from 'ramda';
import React from 'react';
import { View } from 'react-native';
import OrgWidgets from './OrgWidgets';
import TextInput from './TextInput';
import { OrgNodesListItem } from '../containers/OrgNodesList';

// ** Shape

interface TagsInputProps {
  node: OrgNodesListItem;
  rowsNum: number;
  tagsChoices: string[];
  updateNode: (tag: string) => void;
  updateUserInput: (text: string) => void;
  userInput: string;
}

// ** Component

export const TagsInput = ({
  node,
  userInput,
  tagsChoices,
  rowsNum,
  updateNode,
  updateUserInput,
}: TagsInputProps) => {
  const tagsSet = new Set(node.tags);
  const choicesSet = new Set(tagsChoices);
  const addedTags = node.tags.filter((tag) => !choicesSet.has(tag));

  // Update tags choices with added tags
  const tempTagsChoices = R.concat(addedTags, tagsChoices);
  const tempTagsChoicesSet = new Set(tempTagsChoices);
  const choices = Array.from(tempTagsChoicesSet).map((tag) => [
    tag,
    tagsSet.has(tag) ? 1 : 0,
  ]);

  const textToTags = (text: string) => {
    const res = text.split(' ');
    let newText;
    let newTag;
    if (res.length === 1) {
      newText = res[0];
    } else {
      if (!tagsSet.has(res[0])) {
        // newTag = R.toLower(res[0]);
        newTag = res[0];
      }
      newText = res[1];
    }
    if (newTag) {
      tags = R.prepend(newTag, node.tags);
      updateNode(newTag);
    }
    updateUserInput(newText);
  };

  return (
    <View>
      <OrgWidgets.ThreeStatesSelectDialog
        rowsNum={rowsNum}
        onItemPress={updateNode}
        items={choices}
      />
      <TextInput
        value={userInput}
        placeholder="Enter tags"
        onChangeText={textToTags}
        onSubmitEditing={() => {
          updateNode(userInput);
          updateUserInput('');
        }}
      />
    </View>
  );
};
