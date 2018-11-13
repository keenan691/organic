// * DevScreen starts here
// * Imports

import {
  ScrollView,
  SectionList,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";
import PropTypes from "prop-types";
import R, { props } from "ramda";
import React, { Component } from "react";

import { Colors } from "../themes";
import { OrgFile } from "./OrgFilesScreen";
import { OrgNodeEditScreen } from "./OrgNodeEditScreen";
import { captureTemplateFixtures } from "../fixtures";
import { emptyCaptureTemplate } from "../redux/CaptureRedux";
import CaptureTemplates from "../components/CaptureTemplates";
import Separator from "../components/Separator";

// import styles from "./styles/DevScreenStyles";

// * AgendaDialogStory

// const agendaItem = {
//   date: ts.date,
//   dateRangeEnd: ts.dateRangeEnd,
//   repeater: ts.repeater,
//   warningPeriod: ts.warningPeriod,
//   type: ts.type,
//   node:
// };;

const scheduled = {
  type: "scheduled",
  warningPeriod: null,
  repeater: null,
  date: "2018-08-13T22:00:00.000Z",
  dateRangeEnd: null,
  dateRangeWithTime: false,
  dateWithTime: false
};

const scheduledNode = {
  id: "k_jku13e78_w25x6nas8j59qg772pflq",
  level: 1,
  position: 58,
  headline: "Z Domowego",
  content: "",
  fileId: "g_jku10fwn_l1i110ej1ntsd4kybbx36",
  category: null,
  todo: "DONE",
  priority: null,
  drawers: null,
  timestamps: [scheduled],
  tags: ["dupa"]
};

const AgendaDialogStory = () => {
  return (
    <OrgNodeEditScreen
      targetNode={scheduledNode}
      asModal
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
      asModal
      editField="tags"
      title="Tags"
      tagsChoices={["dupa", "huj"]}
      navigator={{ dismissLightBox: () => null }}
      updateNode={() => null}
      dismissAction={() => null}
    />
  );
};

// * Capture Template

const CaptureTemplatesStory = () => {
  return (
    <CaptureTemplates data={captureTemplateFixtures} onPressItem={() => null} />
  );
};

// * OrgFiles

const createOrgFileData = (props = {}, TITLE = "Sample title") => ({
  id: "y_jjjzlw3v_83et6i8uv1vi9q0rur1vn",
  size: 36,
  ctime: new Date(),
  mtime: new Date(),
  path: "/storage/emulated/0/Download/Sync/Cloud (1)/Notes/it.org",
  description: "",
  metadata: {
    TITLE,
    CATEGORY: "Sample Category"
  },
  lastSync: new Date(),
  isChanged: false,
  isConflicted: false,
  isPinned: false,
  ...props
});

const OrgFileStories = props => {
  return (
    <View>
      <OrgFile
        file={createOrgFileData(
          { isChanged: false, isPinned: true },
          "Pinned example"
        )}
        onPress={() => null}
      />
      <Separator />
      <OrgFile
        file={R.merge(createOrgFileData({ isChanged: false }), {
          path: undefined
        })}
        onPress={() => null}
      />
      <Separator />
      <OrgFile
        file={createOrgFileData({ isChanged: true }, "Changed locally")}
        onPress={() => null}
      />
      <Separator />
      <OrgFile
        file={createOrgFileData(
          { isChanged: true, isConflicted: true },
          "Conflicted file"
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

// * Screen

class DevScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true
  };

  constructor(props) {
    super(props);
    // this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  render() {
    return (
      <ScrollView keyboardShouldPersistTaps>
        <View style={{ flex: 1 }}>
          <Text style={{ textAlign: "center", marginTop: 50 }} selectable>
            tesdddfdffft
          </Text>
          <TextInput
            underlineColorAndroid={Colors.menuButton}
            style={{
              /* margin: 20, */
              backgroundColor: "red",
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

export default DevScreen;
