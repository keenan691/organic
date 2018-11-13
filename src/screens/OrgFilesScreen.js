// * Files
// * Imports
import {
  DocumentPicker,
  DocumentPickerUtil
} from "react-native-document-picker";
import {
  FlatList,
  InteractionManager,
  Linking,
  Platform,
  StatusBar,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View
} from "react-native";
import { SharedElementTransition } from "react-native-navigation";
import { SwipeListView } from "react-native-swipe-list-view";
import { connect } from "react-redux";
import DialogAndroid from "react-native-dialogs";
import Icon from "react-native-vector-icons/Ionicons";
import PropTypes from "prop-types";
import R, { props } from "ramda";
import RNGRP from "react-native-get-real-path";
import React, { Component } from "react";
import moment from "moment";

import { CaptureSelectors } from "../redux/CaptureRedux";
import { Colors } from "../themes";
import {
  NavigatorStyle,
  NavigatorStyleDupa
} from "../themes/ApplicationStyles";
import { OrgNode } from "../components/OrgNodesList";
import { SyncSelectors } from "../redux/SyncRedux";
import { formatBytes, pathToFileName } from "../utils/files";
import { getFileTitle } from "../funcs";
import { navigateToOrgElement } from "../navigation";
import { vibrate } from "../vibrations";
import BusyScreen from "../components/BusyScreen";
import EmptyList from "../components/EmptyList";
import OrgDataRedux, { OrgDataSelectors } from "../redux/OrgDataRedux";
import SectionListHeader from "../components/SectionListHeader";
import Separator from "../components/Separator";
import messages from "../messages";
import styles from "./styles/OrgFilesScreenStyles";

// const validateFile = file => true;

// const openDocumentPicker = successHandler => () => {
//   DocumentPicker.show(
//     { filetype: [DocumentPickerUtil.allFiles()] },
//     (error, res) => {
//       if (res) {
//         console.tron.log("select");
//         RNGRP.getRealPathFromURI(res.uri).then(
//           path => (!error && validateFile(path) ? successHandler(path) : null)
//         );
//       }
//     }
//   );
// };

// * OrgFile

const Message = ({ type, text }) => {
  return (
    <View style={[styles.label]}>
      <Icon
        style={[styles.labelIcon, styles[`${type}Message`]]}
        name="ios-refresh-circle"
      />
      <Text style={[styles.labelText, styles[`${type}Message`]]}> {text}</Text>
    </View>
  );
};

const createFileMessages = ({
  path,
  lastSync,
  isConflicted,
  mtime,
  isChanged
}) => {
  const mtimeFromNow = moment(mtime).fromNow();
  let messages = [
    {
      text: path ? mtimeFromNow : "Local",
      type: "info"
    }
  ];
  if (!path) return [];

  //   <View style={styles.label}>
  //   <Icon style={styles.labelIcon} name="ios-refresh-circle" />
  //   <Text style={styles.labelText}>
  //   {" "}
  // {file.path ? mtimeFromNow : "Not exported."}
  // </Text>
  //   </View>
  const hasRemoteChanges = mtime > lastSync;
  isChanged &&
    (messages = [
      {
        text: "Local changes",
        type: "warning"
      }
    ]);

  hasRemoteChanges &&
    (messages = [
      {
        text: "Remote changes",
        type: "warning"
      }
    ]);

  isChanged &&
    hasRemoteChanges &&
    (messages = [
      {
        text: "Local and remote changes. Must resolve manually.",
        type: "error"
      }
    ]);

  return messages;
};

export const OrgFile = ({ file, onPress, onLongPress }) => {
  const fileName = getFileTitle(file);
  const messages = createFileMessages(file);
  const fileSize = formatBytes(file.size);
  return (
    <TouchableOpacity
      style={[styles.item]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <SharedElementTransition sharedElementId={"FileId" + file.id}>
        <Text style={styles.itemTitle}>{fileName}</Text>
      </SharedElementTransition>
      <View style={styles.fileStatus}>
        {messages.map(message => <Message key={message.text} {...message} />)}
      </View>
    </TouchableOpacity>
  );
};

OrgFile.propTypes = {
  file: PropTypes.objectOf(Object).isRequired,
  onPress: PropTypes.func.isRequired
};

// * OrgFileActions

const Action = ({ text, action }) => {
  return (
    <TouchableHighlight
      key={text}
      onPress={() => {
        this.props.runNodeAction(action, this.currentRowKey);
        this.currentRowMap.closeRow();
      }}
    >
      <View style={styles.actionButton}>
        <Text style={styles.actionButtonText}>{text}</Text>
      </View>
    </TouchableHighlight>
  );
};

export const OrgFileActions = ({ file }) => {
  const actions = R.pipe(
    R.toPairs,
    R.map(([key, val]) => Action({ text: key, action: val }))
  )(this.Actions);
  return <View style={styles.rowBack}>{actions}</View>;
};

// * OrgFilesScreen

class OrgFilesScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    const val = Object.keys(this.props.externallyChangedFiles).length;
    if (val > 0) {
      this.props.navigator.setTabBadge({
        badge: "sync", // badge value, null to remove badge
        badgeColor: Colors.warning // (optional) if missing, the badge will use the default color
      });
    } else {
      this.props.navigator.setTabBadge({
        badge: null // badge value, null to remove badge
      });
    }
  }

  renderHiddenItem = ({ item }, rowMap) => {
    const actions = R.pipe(
      R.toPairs,
      R.map(([key, val]) => Action({ text: key, action: val }))
    )(this.Actions);
    return <View style={styles.rowBack}>{actions}</View>;
  };

  openTOC(fileId) {
    this.props.loadToc(fileId, this.props.navigator);
  }

  renderSectionHeader = ({ section: { title } }) => {
    return <SectionListHeader title={title} />;
  };

  getData = () => {
    const res = R.pipe(
      R.map(id =>
        R.merge(
          this.props.files[id],
          R.merge(
            this.props.changedFiles[id] || {},
            this.props.externallyChangedFiles[id] || {}
          )
        )
      ),
      R.sortBy(R.prop("mtime")),
      R.reverse
    )(this.props.filesIds);
    return res;
  };

  renderItem = ({ item, index, section, separators }) => {
    return (
      <OrgFile
        onPress={() => this.openTOC(item.id)}
        onLongPress={() => this.props.showActionsDialog(item)}
        file={item}
        {...props}
      />
    );

    switch (section.title) {
      case "Files":
      case "Current Topics":
        return (
          <OrgNode
            onPressItem={() => {
              navigateToOrgElement(
                this.props.navigator,
                item.fileId,
                // this.lastTouchedNode.id,
                item.id,
                "notes"
              );
            }}
            item={item}
            flat
          />
        );
        break;
    }
  };

  render() {
    const { filesIds, files, navigator } = this.props;
    console.tron.log("render files");
    return (
      <FlatList
        renderItem={this.renderItem}
        data={this.getData()}
        ItemSeparatorComponent={Separator}
        keyExtractor={item => item.id}
        closeOnRowBeginSwipe={false}
        leftOpenValue={250}
        ListEmptyComponent={
          <EmptyList
            itemName={messages.files.vname}
            message={messages.files.description}
          />
        }
        ListHeaderComponent={() => <SectionListHeader title="Notebooks" />}
        previewRowKey={"0"}
        previewOpenValue={-40}
        previewOpenDelay={3000}
        rightOpenValue={-50}
        closeOnScroll={false}
        disableLeftSwipe
        onRowOpen={(rowKey, rowMap) => {
          this.currentRowKey = rowKey;
          this.currentRowMap = rowMap[rowKey];
          setTimeout(() => {
            rowMap[rowKey].closeRow();
          }, 4000);
        }}
      />
    );
  }
}

// * PropTypes

OrgFilesScreen.propTypes = {
  addFile: PropTypes.func.isRequired,
  clearDb: PropTypes.func.isRequired,
  sync: PropTypes.func.isRequired,
  navigator: PropTypes.object.isRequired
};

// * Connect

const mapStateToProps = R.applySpec({
  files: OrgDataSelectors.getFiles,
  filesIds: OrgDataSelectors.getFilesIds,
  externallyChangedFiles: SyncSelectors.getExternallyChangedFiles,
  changedFiles: SyncSelectors.getChangedFiles
});

const mapDispatchToProps = {
  loadToc: OrgDataRedux.loadToc,
  showActionsDialog: OrgDataRedux.showFileActionsDialog
};

export default connect(mapStateToProps, mapDispatchToProps)(OrgFilesScreen);
