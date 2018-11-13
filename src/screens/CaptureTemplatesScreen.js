import {
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

import { Colors, Fonts } from "../themes";
import { OrgDataSelectors } from "../redux/OrgDataRedux";
import { SectionTitle } from '../components/Section';
import { getFileTitle } from "../utils/files";
import CaptureRedux, { CaptureSelectors } from "../redux/CaptureRedux";
import EmptyList from "../components/EmptyList";
import SectionListHeader from '../components/SectionListHeader';
import Separator from "../components/Separator";
import messages from "../messages";
import styles from "./styles/CaptureTemplatesScreenStyles";

// * Screen

class CaptureTemplatesScreen extends Component {
  constructor(props) {
    super(props);
  }

  renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>

        <TouchableOpacity
          onLongPress={() => this.props.showActions(item)}
          onPress={() => this.props.visit(item, this.props.navigator)}
        >
          <Text style={{ fontSize: Fonts.size.h6, color: Colors.fileText }}>{item.name}</Text>
          <Text>
            {/* Wywala się przy usówaniu pliku jeśli jest odznaczone - nawet innego pliku*/}
            {/* <Text */}
            {/*   style={{ */}
            {/*     color: Colors.fileText, */}
            {/*     fontWeight: 'bold' */}
            {/*   }} */}
            {/* > */}
            {/*   {getFileTitle(this.props.files[item.target.fileId])} */}
            {/* </Text> */}
            {/* {item.name !== item.target.headline ? ( */}
            {/*   <Text> */}
            {/*     <Text>/</Text> */}
            {/*     <Text style={{ color: Colors.magenta }}> */}
            {/*       {item.target.headline} */}
            {/*     </Text> */}
            {/*   </Text> */}
            {/* ) : null} */}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    console.tron.log('render ct screen')
    return (
      <View>
        <FlatList
          initialNumToRender={15}
          data={this.props.data}
          renderItem={this.renderItem}
          keyExtractor={item => item.name}
          ItemSeparatorComponent={Separator}


          ListHeaderComponent={() => <SectionListHeader title="Sinks"/>}
          ListEmptyComponent={
            <EmptyList
              itemName={messages.sinks.vname}
              message={messages.sinks.description}
            />
          }
        />
      </View>
    );
  }
}

// * PropTypes

CaptureTemplatesScreen.propTypes = {};

// * Redux

const mapStateToProps = R.applySpec({
  data: CaptureSelectors.captureTemplates,
  files: OrgDataSelectors.getFiles
});

const mapDispatchToProps = {
  visit: CaptureRedux.visitCaptureTemplate,
  showActions: CaptureRedux.showCaptureTemplateActions
};

// * Export

export default connect(mapStateToProps, mapDispatchToProps)(
  CaptureTemplatesScreen
);
