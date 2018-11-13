// * EditScreen
// * Imports
import {
  DatePickerAndroid,
  InteractionManager,
  ScrollView,
  SectionList,
  Text,
  TimePickerAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { Field, reduxForm, registerField, change } from "redux-form";
import { connect } from "react-redux";
import { lifecycle } from "recompose";
import Icon from "react-native-vector-icons/Ionicons";
import Picker from "react-native-picker";
import PropTypes from "prop-types";
import R, { props } from "ramda";
import React, { Component } from "react";
import moment from "moment";

import { Colors, Metrics } from "../themes";
import { SettingsSelectors } from "../redux/SettingsRedux";
import { setTodo} from "../transforms/AgendaTransforms";
import CaptureRedux, { CaptureSelectors } from "../redux/CaptureRedux";
import FullButton from "../components/FullButton";
import OrgDataRedux, { OrgDataSelectors } from "../redux/OrgDataRedux";
import OrgWidgets from "../components/OrgWidgets";
import Section from "../components/Section";
import Separator from "../components/Separator";
import TextInput from "../components/TextInput";
import styles from "./styles/OrgNodeEditScreenStyles";

// * Constants

const EMPTY_VALUES = {
  tags: [],
  timestamps: [],
  todo: null,
  priority: null
};

// * Dialogs

const showRepeaterDialog = (selectedValue, setHandler) => {
  const pickerData = [["+", "++", ".+"], R.range(1, 100), ["h", "d", "w", "m", "y"]];
  Picker.init({
    pickerData,
    pickerConfirmBtnText: "Confirm",
    pickerCancelBtnText: "Cancel",
    pickerTitleText: "Repeater",
    pickerToolBarFontSize: 18,
    pickerFontSize: 18,
    pickerConfirmBtnColor: [205, 92, 92, 1],
    pickerCancelBtnColor: [205, 92, 92, 1],
    selectedValue,
    onPickerConfirm: data => {
      setHandler(data);
    },
    onPickerCancel: data => {
      console.log(data);
    },
    onPickerSelect: data => {
      console.log(data);
    }
  });
  Picker.show();
};

const showTimePicker = async (selectedValue, setHandler) => {
  const date = new Date(selectedValue);
  try {
    const { action, hour, minute } = await TimePickerAndroid.open({
      hour: date.getHours(),
      minute: date.getMinutes()
    });
    if (action !== TimePickerAndroid.dismissedAction) {
      // Selected hour (0-23), minute (0-59)
      date.setMinutes(minute);
      date.setHours(hour);
      setHandler(date);
    }
  } catch ({ code, message }) {
    console.warn("Cannot open time picker", message);
  }
};

export const showDatePickerDialog = async (selectedValue, setHandler) => {
  const date = new Date(selectedValue);
  try {
    const { action, year, month, day } = await DatePickerAndroid.open({
      date: selectedValue
    });
    if (action !== DatePickerAndroid.dismissedAction) {
      date.setYear(year);
      date.setMonth(month);
      date.setDate(day);
      setHandler(date);
    }
  } catch ({ code, message }) {
    console.warn("Cannot open date picker", message);
  }
};

// * Helpers

// const get = ;
const set = field => async () => {
  const currentVal = R.pathOr(new Date(), [field, "date"], this.state);
};

const clear = field => () => {
  this.setState(state => ({ [field]: null }));
};

const SetClearWidget = ({
  label,
  field,
  data,
  selectedValue,
  dialog,
  setHandler,
  outTransform,
  inTransform,
  display = R.identity,
  clearHandler,
  disabled = false,
  separator
}) => {
  let currentVal = inTransform(R.propOr(selectedValue, field, data), data);

  const displayVal = R.isNil(data[field]) ? "none" : display(data[field], data);
  return disabled ? null : (
    <View style={styles.subsectionContainer}>
      {separator && <Separator />}
      <Text>
        {label !== null ? <Text style={styles.label}>{label}: </Text> : null}
        <Text style={styles.value}>{displayVal}</Text>
      </Text>

      <View style={styles.modalActionsContainer}>
        <TouchableOpacity
          onPress={() =>
            clearHandler
              ? clearHandler(data)
              : R.pipe(R.assoc(field, undefined), setHandler)(data)
          }
        >
          <Text style={styles.sectionButtonText}>CLEAR</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            dialog(currentVal, val => {
              R.pipe(R.assoc(field, outTransform(val)), setHandler)(data);
            })
          }
        >
          <Text style={styles.sectionButtonText}>SET</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// * Component
// ** AgendaInput

const toDate = val => new Date(val);
const toIsoString = date => date.toISOString();

let repeaterR = /\s*([\+\.]+)(\d+)([ywmdh])?/;

const extractRepeater = val =>
  R.isNil(val) ? undefined : repeaterR.exec(val).slice(1, 4);

const emptyAgendaObject = type => ({
  type,
  warningPeriod: undefined,
  repeater: undefined,
  date: undefined,
  dateRangeEnd: undefined,
  dateRangeWithTime: undefined,
  dateWithTime: undefined
});

class AgendaInput extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = { ...props.targetNode };
  // }

  get = type => {
    return (
      R.find(R.propEq("type", type), this.props.node.timestamps) ||
      emptyAgendaObject(type)
    );
  };

  set = type => newObj => {
    const timestamps = R.pipe(
      R.reject(R.propEq("type", type)),
      R.append(newObj)
    )(this.props.node.timestamps);
    this.props.updateNode(timestamps);
    // this.setState(state => ({ timestamps }));
  };

  renderSection(type) {
    const get = this.get(type);
    const set = this.set(type);
    return (
      <View style={{ flexDirection: "column" }}>
        <SetClearWidget
          label="Date"
          field="date"
          selectedValue={new Date()}
          outTransform={toIsoString}
          inTransform={toDate}
          data={get}
          dialog={showDatePickerDialog}
          setHandler={set}
          display={val => moment(val).format("YYYY-MM-DD")}
        />

        <SetClearWidget
          separator
          disabled={get.date ? false : true}
          label="Time"
          field="date"
          selectedValue={new Date()}
          outTransform={toIsoString}
          inTransform={toDate}
          data={get}
          dialog={showTimePicker}
          setHandler={R.pipe(R.merge(R.__, { dateWithTime: true }), set)}
          clearHandler={R.pipe(R.merge(R.__, { dateWithTime: false }), set)}
          display={(val, data) => {
            return get.dateWithTime ? moment(val).format("hh:mm") : "none";
          }}
        />
        <SetClearWidget
          separator
          label="Repeater"
          field="repeater"
          disabled={get.date ? false : true}
          selectedValue="+1d"
          outTransform={val => {
            return val ? val.join("") : undefined;
          }}
          inTransform={extractRepeater}
          data={get}
          dialog={showRepeaterDialog}
          setHandler={set}
        />
      </View>
    );
  }

  render() {
    switch (this.props.type) {
      case "deadline":
        return this.renderSection("deadline", "Sd");
        break;
      case "schedule":
        return this.renderSection("scheduled", "Sd");
        break;
    }
  }
}

// ** TodoInput

const TodoInput = ({ node: { todo }, taskStates, rowsNum, updateNode }) => {
  const choices = taskStates.map(state => [state, state === todo ? 1 : 0]);
  return (
    <OrgWidgets.ThreeStatesSelectDialog
      rowsNum={rowsNum}
      onItemPress={updateNode}
      items={choices}
    />
  );
};

// ** TagsInput

const TagsInput = ({
  node,
  userInput,
  tagsChoices,
  rowsNum,
  updateNode,
  updateUserInput
}) => {
  let tags = node.tags;
  // const tagsSet = new Set(node.tags.map(R.toLower));
  const tagsSet = new Set(node.tags);
  const choicesSet = new Set(tagsChoices);

  const addedTags = node.tags
    // .map(R.toLower)
    .filter(tag => !choicesSet.has(tag));

  // Update tags choices with added tags
  const tempTagsChoices = R.concat(addedTags, tagsChoices);
  const tempTagsChoicesSet = new Set(tempTagsChoices);
  const choices = Array.from(tempTagsChoicesSet).map(tag => [
    tag,
    tagsSet.has(tag) ? 1 : 0
  ]);

  const textToTags = text => {
    const res = text.split(" ");
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
          updateUserInput("");
        }}
      />
    </View>
  );
};

// ** PriorityInput

const PriorityInput = ({ node: { priority }, rowsNum, updateNode }) => {
  const choices = ["A", "B", "C"].map(state => [
    state,
    state === priority ? 1 : 0
  ]);
  return (
    <OrgWidgets.ThreeStatesSelectDialog
      rowsNum={1}
      onItemPress={updateNode}
      items={choices}
    />
  );
};

// * Screen

const ModalAction = ({ onPress, text }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.modalAction}>{text}</Text>
    </TouchableOpacity>
  );
};

const onModalItemPress = props => (val, newState) => {};

const dismissLightBoxOnStateChange = lifecycle({
  componentDidUpdate() {
    setTimeout(this.props.finalize, 100);
  }
});

const Row = props => {
  return <View style={styles.row}>{props.children}</View>;
};

const AutoclosingTodoInput = dismissLightBoxOnStateChange(TodoInput);
const AutoclosingPriorityInput = dismissLightBoxOnStateChange(PriorityInput);

const MODAL_INPUTS = {
  timestamps: props => <AgendaInput rowsNum={3} {...props} />,
  todo: props => <AutoclosingTodoInput rowsNum={3} {...props} />,
  tags: props => <TagsInput rowsNum={4} {...props} />,
  priority: props => <AutoclosingPriorityInput {...props} />
};

const REGULAR_INPUTS = {
  todo: props => <TodoInput rowsNum={3} {...props} />,
  tags: props => <TagsInput rowsNum={6} {...props} />,
  priority: props => <PriorityInput {...props} />
};

export class OrgNodeEditScreen extends Component {
  static navigatorStyle = {
    // navBarHidden: true,
    statusBarHidden: false
  };
  static defaultProps = {
    navigationStack: "notes"
  };

  // * State

  componentDidMount() {
    // console.tron.log('did mount fs')
    // console.tron.log(R.keys(this.widget))
  }

  focus() {
    // this.widget.focus();
    // setTimeout(() => this.widget.focus(), 0);
  }

  blur() {
    // this.widget.blur();
    // setTimeout(() => this.widget.blur(), 0);
  }

  constructor(props) {
    super(props);
    // this._unregister = this.props.navigator.addOnNavigatorEvent(this.onNavigatorEvent);
    const editedElementVal =
      R.pathOr(undefined, ["node", this.props.editField], props) ||
      EMPTY_VALUES[this.props.editField];

    this.state = {
      editedNode: {
        [this.props.editField]: editedElementVal
      },
      userInput: ""
    };
  }

  componentWillUnmount() {
    // this._unregister()
  }
  static getDerivedStateFromProps(props) {
    switch (props.navigationStack) {
      // case "capture":
      //   return {
      //     editedNode: props.captureForm
      //   };
      //   break;

      default:
        if (props.targetNode) {
          return {
            editedNode: props.targetNode
          };
        }
    }
  }

  updateNode = obj => {
    this.setState(state => ({
      editedNode: obj
    }));
  };

  renderAsModal(WrappedComponent, title) {
    const Widget = MODAL_INPUTS[this.props.editField];

    // console.tron.log(this.state.editedNode);
    return (
      <TouchableWithoutFeedback onPress={this.props.dismissAction}>
        <View style={styles.modalBg}>
          <TouchableWithoutFeedback onPress={() => null}>
            <View style={styles.modalContainer}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitleText}>{this.props.title}</Text>
                  {this.props.nodesIds && (
                    <Text style={styles.normalText}>
                      Change {this.props.editField} of{" "}
                      {this.props.nodesIds.length} objects.
                    </Text>
                  )}
                  <Widget
                    {...this.props}
                    updateNode={this.updateForm}
                    updateUserInput={text =>
                      this.setState(state => ({ userInput: text }))
                    }
                    node={this.state.editedNode}
                    userInput={this.state.userInput}
                    finalize={this.finalize}
                  />
                </View>
              </View>
              <View style={styles.modalActionsContainer}>
                <ModalAction onPress={this.props.dismissAction} text="CANCEL" />
                <ModalAction onPress={this.clear} text="CLEAR" />
                <ModalAction onPress={this.finalize} text="OK" />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  renderAsSection() {
    const Widget = REGULAR_INPUTS[this.props.editField];
    return (
      <Widget
        {...this.props}
        onItemPress={this.updateForm}
        ref={view => (this.widget = view)}
        updateCaptureForm={this.props.updateCaptureForm}
        node={this.state.editedNode}
      />
    );
  }

  updateForm = newVal => {
    let changes;

    switch (this.props.editField) {
      case "tags":
        const tags = new Set(this.state.editedNode.tags);
        tags.has(newVal) ? tags.delete(newVal) : tags.add(newVal);
        changes = {
          tags: Array.from(tags)
        };
        break;
      case "todo":
        if (this.props.node) {
          changes = setTodo(newVal, this.props.node);
        } else {
          changes = {
            [this.props.editField]: newVal
          };
        }
        break;
      default:
        changes = {
          [this.props.editField]: newVal
        };
    }

    // Set internal state
    this.setState(state => ({
      editedNode: R.merge(this.state.editedNode, changes)
    }));
  };

  render() {
    return this.props.asModal ? this.renderAsModal() : this.renderAsSection();
  }

  clear = () => {
    let changes;

    if (this.props.editField === "timestamps") {
      let tsType = this.props.type;
      // FIXME
      if (tsType === "schedule") tsType = "scheduled";
      changes = R.reject(
        ts => ts.type === tsType,
        this.state.editedNode.timestamps
      );
    } else {
      changes = EMPTY_VALUES[this.props.editField];
    }

    const newData = R.merge(this.state.editedNode, {
      [this.props.editField]: changes
    });

    this.setState(
      state => ({
        editedNode: newData
      }),
      this.finalize
    );
  };

  finalize = () => {
    // console.tron.log("finalize");
    // console.tron.log(this.props);
    switch (this.props.navigationStack) {
      /* ------------- updates capture form ------------- */
      case "capture":
        // this.props.updateCaptureForm(this.state.editedNode);
        this.props.change(
          "capture",
          this.props.editField,
          this.state.editedNode[this.props.editField]
        );
        // this.props.change("capture", "headline", "DONE");

        // console.tron.log(this.state.editedNode);
        this.props.dismissAction();
        break;

      /* ------------- updates directly edited node ------------- */
      default:
        if (this.state.editedNode.id) {
          this.props.updateNode(
            this.state.editedNode,
            undefined,
            this.props.navigationStack
          );
        } else {
          this.props.updateNode(
            this.state.editedNode,
            this.props.nodesIds,
            this.props.navigationStack
          );
        }

        this.props.dismissAction();
    }
  };

  componentWillUnmount() {
    // if (["todo", "priority"].includes(this.props.editField)) {
    //   // If autoclosing modals value is not null
    //   if (this.state.editedNode[this.props.editField] !== null) {
    //     this.finalize();
    //   }
    //   console.tron.log(this.state);
    // }
    if (this.props.onExit) this.props.onExit();
  }
}

// * PropTypes

OrgNodeEditScreen.propTypes = {};

// * Redux

const mapStateToProps = R.applySpec({
  tagsChoices: OrgDataSelectors.getTags,
  taskStates: SettingsSelectors.taskStates,
  captureForm: CaptureSelectors.captureForm
});

const mapDispatchToProps = {
  updateNode: OrgDataRedux.updateNode,
  updateCaptureForm: CaptureRedux.updateCaptureForm,
  change
};

// * Export

export default connect(mapStateToProps, mapDispatchToProps)(OrgNodeEditScreen);
