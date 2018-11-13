// * LastCapturedScreen starts here
// * Imports

import {
  Dimensions,
  FlatList,
  SectionList,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";
import PropTypes from "prop-types";
import R, { props } from "ramda";
import React, { Component } from "react";

import { Colors, Fonts, Metrics } from "../themes";
import { getFileTitle } from "../utils/files";
import CaptureRedux from "../redux/CaptureRedux";
import EmptyList from "../components/EmptyList";
import OrgDataRedux, { OrgDataSelectors } from "../redux/OrgDataRedux";
import OrgNodesList from "../components/OrgNodesList";
import SectionListHeader from "../components/SectionListHeader";
import Separator from "../components/Separator";
import messages from "../messages";
import styles from "./styles/LastCapturedScreenStyles";

// * Screen

class LastCapturedScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true
  };

  onNavigatorEvent = event => {
    if (event.type === "ScreenChangedEvent") {
      switch (event.id) {
        case "didAppear":
      }
    }

    if (event.type === "NavBarButtonPress") {
      switch (event.id) {
        case "cancel":
          break;
      }
    }
  };

  constructor(props) {
    super(props);
    this.props.navigator.addOnNavigatorEvent(this.onNavigatorEvent);
  }

  renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          onLongPress={() => this.props.showActions(item)}
          onPress={() => this.props.visit(item, this.props.navigator)}
        >
          <Text style={{ fontSize: Fonts.size.h5 }}>{item.name}</Text>
          <Text>
            <Text
              style={{
                color: Colors.cyan
              }}
            >
              {getFileTitle(this.props.files[item.target.fileId])}
            </Text>
            {item.name !== item.target.headline ? (
              <Text>
                <Text>/</Text>
                <Text style={{ color: Colors.magenta }}>
                  {item.target.headline}
                </Text>
              </Text>
            ) : null}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    console.tron.log("render last captured");
    return (
      <View>
        <OrgNodesList
          {...this.props}
          useFlatList
          navBarHidden
          data={this.props.items}
          navigator={this.props.navigator}
          runNodeAction={this.props.runNodeAction}
          // ref={view => (this.nodesList = view)}
          flat
          navigationStack="notes"
          dataStack="lastCaptured"
          dismissEditMenu={this.showMenu}
          ListHeaderComponent={() => (
            <View style={{ marginBottom: 8 }}>
              <SectionListHeader title="Last Notes" />
            </View>
          )}
          ListEmptyComponent={
            <EmptyList
              itemName="Last notes"
              // message={messages.sinks.description}
            />
          }
        />
      </View>
    );
  }
}

// * PropTypes

LastCapturedScreen.propTypes = {};

// * Redux

const mapStateToProps = R.applySpec({
  items: OrgDataSelectors.getLastCapturedNotes
});

const mapDispatchToProps = {
  runNodeAction: OrgDataRedux.runNodeActionRequest
};

// * Export

export default connect(mapStateToProps, mapDispatchToProps)(LastCapturedScreen);
