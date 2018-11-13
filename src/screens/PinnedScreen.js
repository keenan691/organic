// * Import

import {
  FlatList,
  InteractionManager,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import R from "ramda";
import React, { Component } from "react";

import { Colors, Metrics } from "../themes";
import {
  NavigatorStyle,
  NavigatorStyleAlternative
} from "../themes/ApplicationStyles";
import { getFileTitle } from "../utils/files";
import { navigateToOrgElement } from "../navigation";
import BusyScreen from "../components/BusyScreen";
import CaptureRedux from "../redux/CaptureRedux";
import EmptyList from "../components/EmptyList";
import OrgDataRedux, { OrgDataSelectors } from "../redux/OrgDataRedux";
import OrgNodesList from "../components/OrgNodesList";
import OrgSearcherRedux, {
  OrgSearcherSelectors
} from "../redux/OrgSearcherRedux";
import Separator from "../components/Separator";
import messages from "../messages";
import styles from "./styles/PinnedScreenStyles";

// * PinnedScreen

class PinnedScreen extends Component {
  renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onLongPress={() => this.props.showActions(item)}
        onPress={() => {
          this.props.navigator.toggleDrawer({ to: "closed" });
          navigateToOrgElement(
            this.props.navigator,
            item.fileId,
            item.id,
            "notes"
          );
        }}
      >
        <View style={styles.itemContainer}>
          <Text>{item.headline}</Text>
          <Text
            style={{
              color: Colors.cyan
            }}
          >
            {getFileTitle(this.props.files[item.fileId])}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  shouldComponentUpdate(nextPromp, prevProps) {
    return true;
  }
  render() {
    console.tron.log("render pinned");
    return (
      <FlatList
        initialNumToRender={15}
        data={this.props.data}
        renderItem={this.renderItem}
        keyExtractor={item => item.name}
        ItemSeparatorComponent={Separator}
        ListEmptyComponent={props => {
          return (
            <Text style={styles.itemContainer}>
              {messages.marks.description}
            </Text>
          );
        }}

        // navigationStack="notes"
        // dataStack="markedPlaces"
        // runNodeAction={this.props.runNodeAction}
        // {...this.props}
      />
    );
  }
}

const mapStateToProps = R.applySpec({
  data: OrgDataSelectors.getMarkedPlaces,
  files: OrgDataSelectors.getFiles
});

const mapDispatchToProps = {
  // search: OrgSearcherRedux.search,
  runNodeAction: OrgDataRedux.runNodeAction,
  showActions: CaptureRedux.showCaptureTemplateActions
  // visitPlace: OrgDataRedux.visitPlace,
  // openFileRequest: OrgDataRedux.openFileRequest,
  // updateNode: OrgDataRedux.updateNode
};

export default connect(mapStateToProps, mapDispatchToProps)(PinnedScreen);
