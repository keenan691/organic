import {
  Dimensions,
  FlatList,
  Picker,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { connect } from "react-redux";
import DialogAndroid from "react-native-dialogs";
import R from "ramda";
import React, { Component } from "react";

import { Colors } from "../themes";
import { vibrate } from "../vibrations";
import CaptureRedux, { CaptureSelectors } from "../redux/CaptureRedux";
import EmptyList from "./EmptyList";
import NavigationRedux, { NavigationSelectors } from "../redux/NavigationRedux";
import messages from "../messages";
import styles from "./styles/CaptureTemplatesStyles";

const NUM_COLUMNS = 3;

const createBorder = direction => {
  switch (direction) {
    case "left":
      return { borderLeftWidth: 1 };
    case "right":
      return { borderRightWidth: 1 };
    case "top":
      return { borderTopWidth: 1 };
    case "bottom":
      return { borderBottomWidth: 1 };
    default:
  }
};

const addInnerBorder = (styles, { indexItem, numItems, numColumns }) => {
  const numRows = Math.ceil(numItems / numColumns);
  const currentRowIndex = Math.floor(indexItem / numColumns);
  const isLastRow = () => currentRowIndex === numRows - 1;
  const currentColumnIndex = indexItem % numColumns;
  const isLastColumn = () => currentColumnIndex === numColumns - 1;
  // console.tron.log(currentColumnIndex);
  // console.tron.log(numColumns);

  return R.pipe(
    R.when(R.complement(isLastRow), R.append(createBorder("bottom"))),
    R.when(R.complement(isLastColumn), R.append(createBorder("right")))
  )(styles);
};

class CaptureTemplates extends Component {
  renderItem = ({ item, index }) => {
    const numItems = this.props.data.length;
    const itemStyles = [styles.item];
    if (item.name === this.props.selected) {
      itemStyles.push(styles.selected);
    }
    return (
      <TouchableOpacity
        onLongPress={() => this.props.handleAction(item)}
        onPress={() => this.props.onPressItem(item.name)}
      >
        <View
          style={addInnerBorder(itemStyles, {
            indexItem: index,
            numItems,
            numColumns: NUM_COLUMNS
          })}
        >
          <Text style={[styles.itemTitle, styles[item.type]]}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    console.tron.log("renders capture templates");
    return (
      <View>
        <FlatList
          data={this.props.data}
          keyExtractor={item => item.name}
          renderItem={this.renderItem}
          numColumns={NUM_COLUMNS}
          contentContainerStyle={styles.contentContainer}
          extraData={this.props.selected}
          ListEmptyComponent={
            <EmptyList
              itemName={messages.captureTemplates.vname}
              message={messages.captureTemplates.description}
            />
          }
        />
      </View>
    );
  }
}

const mapStateToProps = R.applySpec({
  data: CaptureSelectors.captureTemplates,
  selected: NavigationSelectors.getSelectedCaptureTemplate
});

const mapDispatchToProps = {
  onPressItem: NavigationRedux.selectCaptureTemplateRequest,
  handleAction: CaptureRedux.showCaptureTemplateActions
};

export default connect(mapStateToProps, mapDispatchToProps)(CaptureTemplates);
