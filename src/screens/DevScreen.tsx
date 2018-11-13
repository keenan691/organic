// * DevScreen.tsx

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
import React, { Component } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { OrgFile } from '../components/OrgFile';
import Separator from '../components/Separator';
import CaptureTemplates from '../containers/CaptureTemplates';
import { captureTemplateFixtures } from '../fixtures';
import { Colors } from '../themes';
import { OrgNodeEditScreen } from './OrgNodeEditScreen';

const scheduled = {
  type: 'scheduled',
  warningPeriod: null,
  repeater: null,
  date: '2018-08-13T22:00:00.000Z',
  dateRangeEnd: null,
  dateRangeWithTime: false,
  dateWithTime: false,
};

const scheduledNode = {
  id: 'k_jku13e78_w25x6nas8j59qg772pflq',
  level: 1,
  position: 58,
  headline: 'Z Domowego',
  content: '',
  fileId: 'g_jku10fwn_l1i110ej1ntsd4kybbx36',
  category: null,
  todo: 'DONE',
  priority: null,
  drawers: null,
  timestamps: [scheduled],
  tags: ['dupa'],
};

const AgendaDialogStory = () => {
  return (
    <OrgNodeEditScreen
      targetNode={scheduledNode}
      asModal={true}
      editField="timestamps"
      title="Agenda"
      dismissAction={() => null}
    />
  );
};

const TagsDialogStory = () => {
  return (
    <OrgNodeEditScreen
      targetNode={scheduledNode}
      asModal={true}
      editField="tags"
      title="Tags"
      tagsChoices={['dupa', 'huj']}
      navigator={{ dismissLightBox: () => null }}
      updateNode={() => null}
      dismissAction={() => null}
    />
  );
};

// ** Capture Template

const CaptureTemplatesStory = () => {
  return (
    <CaptureTemplates data={captureTemplateFixtures} onPressItem={() => null} />
  );
};

// ** OrgFiles

const createOrgFileData = (props = {}, TITLE = 'Sample title') => ({
  id: 'y_jjjzlw3v_83et6i8uv1vi9q0rur1vn',
  size: 36,
  ctime: new Date(),
  mtime: new Date(),
  path: '/storage/emulated/0/Download/Sync/Cloud (1)/Notes/it.org',
  description: '',
  metadata: {
    TITLE,
    CATEGORY: 'Sample Category',
  },
  lastSync: new Date(),
  isChanged: false,
  isConflicted: false,
  isPinned: false,
  ...props,
});

const OrgFileStories = (props) => {
  return (
    <View>
      <OrgFile
        file={createOrgFileData(
          { isChanged: false, isPinned: true },
          'Pinned example',
        )}
        onPress={() => null}
      />
      <Separator />
      <OrgFile
        file={R.merge(createOrgFileData({ isChanged: false }), {
          path: undefined,
        })}
        onPress={() => null}
      />
      <Separator />
      <OrgFile
        file={createOrgFileData({ isChanged: true }, 'Changed locally')}
        onPress={() => null}
      />
      <Separator />
      <OrgFile
        file={createOrgFileData(
          { isChanged: true, isConflicted: true },
          'Conflicted file',
        )}
        onPress={() => null}
      />
      <Separator />
      <OrgFile
        file={createOrgFileData({ isChanged: true })}
        onPress={() => null}
      />
      <Separator />
      <OrgFile
        file={createOrgFileData({ isChanged: true })}
        onPress={() => null}
      />
    </View>
  );
};

// ** Screen

class DevScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  render() {
    return (
      <ScrollView keyboardShouldPersistTaps={true}>
        <View style={{ flex: 1 }}>
          <Text
            style={{ textAlign: 'center', marginTop: 50 }}
            selectable={true}
          >
          </Text>
          <TextInput
            underlineColorAndroid={Colors.menuButton}
            style={{
              /* margin: 20, */
              backgroundColor: 'red',
              /* height: "100%", */
              /* opacity: 0, */
              /* position: "absolute", */
              /* width: "100%" */
            }}
          />
        </View>
      </ScrollView>
    );
  }
}

// * Exports

export default DevScreen;
