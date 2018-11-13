// * OrgNodesList

import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Picker,
  SectionList,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Vibration,
  View
} from "react-native";
import {
  Directions,
  FlingGestureHandler,
  PinchGestureHandler,
  RectButton,
  State,
  TapGestureHandler,
  gestureHandlerRootHOC
} from "react-native-gesture-handler";
import { SharedElementTransition } from "react-native-navigation";
import { SwipeListView } from "react-native-swipe-list-view";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";
import Immutable from "seamless-immutable";
import MeasureText from "react-native-measure-text";
import PropTypes from "prop-types";
import R from "ramda";
import React, { Component, PureComponent } from "react";
import moment from "moment";

import { Colors, Metrics } from "../themes";
import { ContextMenuStyles } from "../themes/ApplicationStyles";
import { OrgDataSelectors } from "../redux/OrgDataRedux";
import { getFileTitle } from "../utils/files";
import { hideIfNoProps } from "./HOCs";
import {
  navigateToDay,
  navigateToOrgElement,
  showEditModal
} from "../navigation";
import { vibrate } from "../vibrations";
import OrgContent from "./OrgContent";
import SectionListHeader from "./SectionListHeader";
import Separator from "./Separator";
import styles from "./styles/OrgNodesListStyles";

// * Configuration

// NodeActionsConfiguration = [
//   {
//     text: "Todo",
//     action: "setTodo"
//   },

//   {
//     text: "Edit",
//     action: "setTags"
//   },

//   {
//     text: "Delete",
//     action: "setTags"
//   }
// ];

export const ModeTypes = Object.freeze({
  OUTLINE: "outline",
  AGENDA: "agenda",
  BROWSER: "browser"
});

const FLINGE_DELTA = 900;

// * Temp

// <TapGestureHandler
//   maxDurationMs={50}
//   numberOfTaps={2}
//   onHandlerStateChange={({ nativeEvent }) => {
//     console.tron.log('TAP EV')
//     if (nativeEvent.numberOfPointers === 2) {
//       this.lastTwoFingersTouch = new Date();
//     } else
//     if (nativeEvent.numberOfPointers === 1) {
//       this.lastOneFingerTouch = new Date();
//     }
//   }}
// >

// * Actions

// const runNodeAction(event, selectedNodesIds) => {
//   switch (event.id) {

//   case "todo":
//     showEditModal(this.props.navigator, {
//       nodesIds: selectedNodesIds,
//       targetNode,
//       editField: "todo",
//       title: "Select todos",
//       navigationStack:
//       this.props.dataStack || this.props.navigationStack
//     });
//     break;

//     break;
//   }
// }

// * Helper components
// ** Todo

const Todo = hideIfNoProps(({ todo }) => (
  <Text style={[styles.todo, todo === "DONE" ? styles.doneText : {}]}>
    {todo}{" "}
  </Text>
));

Todo.propTypes = {
  todo: PropTypes.string,
  isDone: PropTypes.bool
};

// ** Priority

const Priority = hideIfNoProps(({ priority }) => (
  <Text style={styles.priority}>[#{priority}] </Text>
));

Priority.propTypes = {};

// ** Tags

const Tags = ({ data }) => {
  if (!data || data.length === 0) return null;
  // data = R.reject(R.equals("PIN"), data);
  return <Text style={styles.tags}> :{data.join(":")}:</Text>;
};

Tags.propTypes = {};

// * Main components
// ** Headline

export const TouchableHeadline = props => {
  const baseLevel = props.baseLevel || 1;
  const levelMargin = props.flat ? 0 : 28 * (props.level - baseLevel);
  // const levelMargin = 0;
  let headlineStyle = [styles[`h${props.level}`], { marginLeft: levelMargin }];

  switch (props.role) {
    case "visited":
      headlineStyle.push(styles.visitedHeadline);
      break;
    // default:
    //   headlineStyle = styles[`h${props.level}`];
  }
  return (
    <Text>
      <Text
        onPress={props.onTodoPress}
        style={[headlineStyle, props.style || {}]}
      >
        <Todo todo={props.todo} />
      </Text>
      <Text
        onPress={props.onPriorityPress}
        style={[headlineStyle, props.style || {}]}
      >
        <Priority priority={props.priority} />
      </Text>
      <Text
        onPress={props.onHeadlineContentPress}
        style={[headlineStyle, props.style || {}]}
      >
        <OrgContent content={props.headline} asHeadline />
      </Text>

      <Text
        onPress={props.onTagsPress}
        onLongPress={props.onTagsLongPress}
        style={[headlineStyle, props.style || {}]}
      >
        <Tags data={props.tags} />
      </Text>
    </Text>
  );
};

export const Headline = props => {
  const baseLevel = props.baseLevel || 1;
  const levelMargin = props.flat ? 0 : 28 * (props.level - baseLevel);
  // const levelMargin = 0;
  let headlineStyle = [styles[`h${props.level}`], { marginLeft: levelMargin }];

  switch (props.role) {
    case "visited":
      headlineStyle.push(styles.visitedHeadline);
      break;
    // default:
    //   headlineStyle = styles[`h${props.level}`];
  }
  return (
    <View
      style={{
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row"
      }}
    >
      <View style={{ width: "90%" }}>
        <Text selectable={props.selectable} style={[headlineStyle, props.style || {}]}>
          <Todo todo={props.todo} />
          <Priority priority={props.priority} />
          <OrgContent content={props.headline} asHeadline />
          <Tags data={props.tags} />
        </Text>
      </View>
      <View>
        {props.showEllipsis && (
          <Icon style={headlineStyle} name="ios-arrow-forward" />
        )}
      </View>
    </View>
  );
};

Headline.propTypes = {
  headline: PropTypes.string.isRequired
};

// ** Metadata

const Metadata = props => (
  <View style={styles.container}>
    <Text style={styles.titleText}>Metadata</Text>
  </View>
);

Metadata.propTypes = {};

// ** Content

const Content = props => (
  <View style={styles.contentContainer}>
    <Text style={styles.contentText}>{props.content}</Text>
  </View>
);

Content.propTypes = {};

// * OrgSearchResult

export const OrgSearchResult = props => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Text style={styles[`h${props.level}`]}>
        <Todo todo={props.todo} />
        <Priority priority={props.priority} />
        <Text>
          <OrgContent content={props.headline} asHeadline />
        </Text>
      </Text>
      {props.content ? (
        <Text style={styles.contentText}>{props.content}</Text>
      ) : null}
    </TouchableOpacity>
  );
};

OrgSearchResult.propTypes = {
  onPress: PropTypes.func.isRequired
};
// * OrgNode

const getHeadlineIconName = item => {
  let headlineIconName;
  switch (item.content ? item.content.split("\n").length : 0) {
    case 0:
    case 1:
      return (headlineIconName = "ios-radio-button-off");
    case 2:
    case 3:
      return (headlineIconName = "ios-disc-outline");
    default:
      return (headlineIconName = "ios-disc");
  }
};

export class OrgNode extends PureComponent {
  render() {
    const { flat, item, onPressItem, showContent = false } = this.props;
    const content = item.content.trim();
    return (
      <View>
        <TouchableHighlight
          underlayColor={"white"}
          style={[styles.nodeContainer, styles[item.role + "NodeBg"]]}
          onPress={() => onPressItem(item.id)}
        >
          <Headline
            flat={flat}
            iconName={getHeadlineIconName(item)}
            showEllipsis={item.hasHiddenChildren}
            {...item}
          />
        </TouchableHighlight>
        {showContent && content ? (
          <View style={styles.nodeContainer}>
            <OrgContent content={content} />
          </View>
        ) : null}
      </View>
    );
  }
}

const formatTimestamp = ts => {
  let res = ts.dateWithTime
    ? moment(ts.date).format("YYYY-MM-DD HH:mm")
    : moment(ts.date).format("YYYY-MM-DD");
  if (ts.repeater) {
    res = res + " " + ts.repeater.toUpperCase();
  }
  return res;
};

const AgendaDisplay = ({ node }) => {
  let scheduled = null;
  let deadline = null;

  node.timestamps.forEach(timestamp => {
    switch (timestamp.type) {
      case "scheduled":
        scheduled = formatTimestamp(timestamp);
        break;
      case "deadline":
        deadline = formatTimestamp(timestamp);
        break;
    }
  });

  return (
    <View style={{ flexDirection: "row" }}>
      <Text>{node.warningDays}</Text>
      {scheduled && (
        <Text style={styles.agendaDisplay}>
          <Text style={styles.label}>S:</Text> {scheduled}
        </Text>
      )}
      {deadline && (
        <Text style={styles.agendaDisplay}>
          <Text style={styles.label}> D:</Text> {deadline}
        </Text>
      )}
    </View>
  );
};

const Link = ({ day, disabled }) => {
  const props = {
    style: styles.link
  };
  if (!disabled)
    props.onPress = () => navigateToDay(moment(day.date).format("YYYY-MM-DD"));

  return <Text {...props}>{formatTimestamp(day)}</Text>;
};

export const AgendaDisplayLong = ({ node, linksDisabled }) => {
  let scheduled = undefined;
  let deadline = undefined;
  let closed = undefined;
  node.timestamps.forEach(timestamp => {
    switch (timestamp.type) {
      case "scheduled":
        scheduled = timestamp;
        break;
      case "deadline":
        deadline = timestamp;
        break;
      case "closed":
        closed = timestamp;
        break;
    }
  });
  return (
    <View>
      {scheduled && (
        <Text style={styles.agendaDisplay}>
          <Text style={styles.label}>Scheduled:</Text>{" "}
          <Link disabled={linksDisabled} day={scheduled} />
        </Text>
      )}
      {deadline && (
        <Text style={styles.agendaDisplay}>
          <Text style={styles.label}>Deadline:</Text>{" "}
          <Link disabled={linksDisabled} day={deadline} />
        </Text>
      )}
      {closed && (
        <Text style={styles.agendaDisplay}>
          <Text style={styles.label}>Closed:</Text>{" "}
          <Link disabled={linksDisabled} day={closed} />
        </Text>
      )}
    </View>
  );
};

const AgendaTodayDisplay = ({ node, now }) => {
  const date = moment(node.date);

  const formattedDate =
    date.format("YYYY-DD-MM") + node.dateWithTime
      ? " " + moment(node.date).format("HH:mm")
      : "";

  return (
    <View style={{ flexDirection: "row" }}>
      {node.type === "closed" && (
        <Text style={styles.agendaDisplay}>Closed {formattedDate}</Text>
      )}
      {node.type === "scheduled" &&
        node.todo != "DONE" && (
          <Text style={styles.agendaDisplay}>
            <Text>
              Scheduled{node.warningPeriod > 0
                ? " " + node.warningPeriod + "x"
                : ""}
            </Text>
          </Text>
        )}
      {node.type === "deadline" &&
        node.todo != "DONE" && (
          <Text style={styles.agendaDisplay}>
            {" "}
            Deadline in {-node.warningPeriod} days
          </Text>
        )}
    </View>
  );
};

export class OrgNodePerformant extends PureComponent {
  shouldComponentUpdate(nextProps, nextState) {
    if (
      R.equals(this.props.item, nextProps.item) &&
      nextProps.selected === this.props.selected
    ) {
      return false;
    }
    return true;
  }
  render() {
    const {
      flat,
      item,
      onPressItem,
      selected,
      hideAgenda,
      showCategory = false,
      showContent = false,
      files
    } = this.props;
    const baseLevel = item.baseLevel || 1;
    const levelMargin = flat ? 0 : 28 * (item.level - baseLevel);

    let headlineStyle = [
      flat ? styles["h0"] : styles[`h${item.level}`],
      { marginLeft: levelMargin }
    ];

    const height = this.props.heights[item.id];
    const nodeStyles = [
      {
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: Metrics.doubleBaseMargin,
        paddingVertical: Metrics.baseMargin,
        height
        // backgroundColor: Colors.bg
      }
    ];
    selected && nodeStyles.push({ backgroundColor: Colors.white });
    return (
      <View style={nodeStyles}>
        <Text style={headlineStyle}>
          <Icon
            name={getHeadlineIconName(item)}
            style={[headlineStyle, styles.icon]}
          />
          {"  "}
          {item.todo && (
            <Text
              style={[styles.todo, item.todo === "DONE" ? styles.doneText : {}]}
            >
              {item.todo}{" "}
            </Text>
          )}
          {item.priority && (
            <Text style={styles.priority}>[#{item.priority}] </Text>
          )}

          <Text>
            <OrgContent content={item.headline} asHeadline />
          </Text>
          <Tags data={item.tags} />
        </Text>
        <View style={styles.categoryContainer}>
          {showCategory ? (
            <Text style={styles.category}>
              {getFileTitle(files[item.fileId])}
            </Text>
          ) : null}
        </View>

        <View style={styles.agendaContainer}>
          {hideAgenda ? (
            <AgendaTodayDisplay node={item} now={this.props.now} />
          ) : (
            <AgendaDisplay node={item} />
          )}
        </View>
        <View style={{}}>
          {item.hasHiddenChildren && (
            <Icon style={headlineStyle} name="ios-arrow-forward" />
          )}
        </View>
      </View>
    );
  }
}

OrgNode.propTypes = {
  item: PropTypes.object.isRequired,
  showContent: PropTypes.bool,
  onPressItem: PropTypes.func
};

// * BatchEditActionButtons

export const BatchEditActionButtons = icons => [
  {
    title: "Agenda",
    id: "agenda",
    showAsAction: "always",
    // icon: "ios-time-outline"
    icon: icons[27]
  },

  {
    title: "Priority",
    id: "priority",
    showAsAction: "always",
    // icon: "ios-trending-up-outline"

    icon: icons[20]
  },
  {
    id: "tags",
    title: "Tags",
    showAsAction: "always",
    // icon: "ios-color-wand-outline" // ios-hand, ios-more

    icon: icons[19]
  },
  {
    title: "Todo",
    id: "todo",
    showAsAction: "always",
    // icon: "ios-construct-outline" // ios-construct

    icon: icons[18]
  },
  {
    id: "delete",
    showAsAction: "always",
    // icon: "ios-construct-outline" // ios-construct
    icon: icons[21]
  }
];

export const EditActionButtons = (icons, moveMode) => [
  {
    id: moveMode === "tree" ? "moveDown" : "moveDownNote",
    showAsAction: "always",
    icon: icons[11]
  },
  {
    id: moveMode === "tree" ? "moveUp" : "moveUpNote",
    showAsAction: "always",
    icon: icons[12]
  },
  {
    id: moveMode === "tree" ? "moveRight" : "moveRightNote",
    showAsAction: "always",
    icon: icons[23]
  },
  {
    id: moveMode === "tree" ? "moveLeft" : "moveLeftNote",
    showAsAction: "always",
    icon: icons[22]
  },
  {
    id: moveMode === "tree" ? "toggleMoveNote" : "toggleMoveTree",
    showAsAction: "always",
    title: moveMode === "tree" ? "Move tree" : "Move note"
  }
];

// * OrgNodesList

const nodeKeyExtractor = node => node.id;
const MOVE_MODES = {
  moveTree: "tree",
  moveNote: "note"
};

class OrgNodesList extends Component {
  state = {
    selected: new Map(),
    moveMode: MOVE_MODES.moveTree,
    mode: ModeTypes.BROWSER,
    flinged: null
  };

  doubleTapRef = React.createRef();

  constructor(props) {
    super(props);
    this.cache = {};
    this.offsets = {};
    this._unregisterNavigationEvents = this.props.navigator.addOnNavigatorEvent(
      this.onNavigatorEvent
    );
    this.listView = React.createRef();
  }

  showModeMenu = mode => {
    switch (mode) {
      case ModeTypes.OUTLINE:
        this.setOutlineMenu();
        break;
      case ModeTypes.AGENDA:
        this.setBatchEditMenu();
        break;
      case ModeTypes.BROWSER:
        this.dismissEditMenu();
        break;
    }

    this.props.navigator.setStyle({
      navBarHidden: false
    });
    // if (this.state.selected.size > 0) {
    //   this.props.navigator.setStyle({
    //     navBarHidden: false
    //   });
    // } else {
    //   this.props.navigator.setStyle({
    //     navBarHidden: true
    //   });
    // }
  };

  onNavigatorEvent = event => {
    // switch (event.type) {
    //   case "NavBarButtonPress":
    //     break;
    // }

    switch (event.id) {
      case "contextualMenuDismissed":
        break;

      case "toggleMoveNote":
        this.setState(state => ({
          moveMode: "note"
        }));
        this.setOutlineMenu();
        break;

      case "toggleMoveTree":
        this.setState(state => ({
          moveMode: "tree"
        }));
        this.setOutlineMenu();
        break;

      case "dismissMenu":
        this.dismissEditMenu();
        this.clearSelection();
        this.setState({
          mode: ModeTypes.BROWSER
        });
        break;
    }
  };

  selectItem = item => {
    // const item = this.lastTouchedNode;

    const cm = this.getCurrentMode();
    const selected = new Map(this.state.selected);
    let nextMode = cm;
    const itemId = this.getKeyExtractor()(item);

    switch (cm) {
      case ModeTypes.AGENDA:
        // selected.set(itemId, true);
        if (selected.has(itemId)) {
          if (selected.size === 1) nextMode = ModeTypes.OUTLINE;
          selected.delete(itemId);
        } else {
          selected.set(itemId, true);
        }
        break;
      case ModeTypes.OUTLINE:
        if (selected.has(itemId)) {
          // nextMode = ModeTypes.AGENDA;
        } else {
          selected.clear();
          selected.set(itemId, true);
        }
        break;
      case ModeTypes.BROWSER:
        selected.set(itemId, true);
        // nextMode = this.props.canOutline ? ModeTypes.OUTLINE : ModeTypes.AGENDA;
        break;
    }

    this.setState(state => {
      return { selected };
    });

    this.showModeMenu(cm);

    return selected;
  };

  narrowToNode = item => {
    const delta = new Date() - this.lastNavigateAction;
    if (delta < 600) return;

    this.lastNavigateAction = new Date();

    navigateToOrgElement(
      this.props.navigator,
      this.lastTouchedNode.fileId,
      this.lastTouchedNode.id,
      this.props.navigationStack
    );
  };

  getCurrentSectionId() {
    return R.findIndex(R.propEq("title", this.currentSectionTitle))(
      this.props.data
    );
  }

  scrollToNextSection() {
    const currentSectionId = this.getCurrentSectionId();
    const id =
      currentSectionId < this.props.data.length - 1 ? currentSectionId + 1 : 0;
    this.listView.current.scrollToLocation({
      itemIndex: 0,
      sectionIndex: id,
      viewOffset: Metrics.doubleBaseMargin * 2.37
    });
  }

  scrollToPrevSection() {
    const currentSectionId = this.getCurrentSectionId();
    const id =
      currentSectionId > 0 ? currentSectionId - 1 : this.props.data.length - 1;
    this.listView.current.scrollToLocation({
      itemIndex: 0,
      sectionIndex: id,
      viewOffset: Metrics.doubleBaseMargin * 2.37
    });
  }

  clearSelection = () => {
    this.setState(state => ({ selected: new Map() }));
  };

  clearTitle() {
    this.props.navigator.setSubTitle({
      subtitle: ""
    });
    this.props.navigator.setTitle({
      title: ""
    });
  }

  setBatchEditMenu() {
    this.clearTitle();
    const batchEditButtons = BatchEditActionButtons(this.props.icons);
    this.props.navigator.setButtons({
      leftButtons: [
        {
          id: "dismissMenu",
          showAsAction: "always",
          icon: this.props.icons[26]
        }
      ],
      rightButtons: batchEditButtons
    });
    this.props.navigator.setStyle({
      navBarBackgroundColor: Colors.editMenuColor
    });
  }

  setOutlineMenu() {
    this.clearTitle();
    this.props.navigator.setButtons({
      leftButtons: [
        {
          id: "dismissMenu",
          showAsAction: "always",
          icon: this.props.icons[26]
        }
      ],
      rightButtons:
        this.props.EditActionButtons ||
        EditActionButtons(this.props.icons, this.state.moveMode)
    });
    this.props.navigator.setStyle(ContextMenuStyles.primary);
  }

  dismissEditMenu() {
    this.props.dismissEditMenu
      ? this.props.dismissEditMenu()
      : this.props.navigator.setStyle({
          navBarHidden: true
        });
  }

  onPress = item => {
    const now = new Date();
    const cm = this.getCurrentMode();

    if (this.touchType === "twoFingers") {
      vibrate()
      this.touchType = undefined;
      this.props.runNodeAction("edit", [item.id], this.props.navigator, item);
      return;
    }

    /* ------------- After flinge press ------------- */

    if (item.id === this.lastTouchedNode.id) {
      if (
        this.lastLeftFlingeGesture &&
        now - this.lastLeftFlingeGesture < FLINGE_DELTA
      ) {
        vibrate(30);
        this.props.runNodeAction("tags", [item.id], this.props.navigator, item);
        return;
      }
      if (
        this.lastRightFlingeGesture &&
        now - this.lastRightFlingeGesture < FLINGE_DELTA
      ) {
        vibrate(30);
        this.props.runNodeAction(
          "cycleTodoState",
          [item.id],
          this.props.navigator,
          item
        );
        return;
      }
    }

    /* ------------- Normal press ------------- */

    vibrate();
    switch (cm) {
      case ModeTypes.BROWSER:
        this.narrowToNode(item);
        break;
      default:
        if (
          this.state.selected.size === 1 &&
          this.state.selected.has(this.getKeyExtractor()(item))
        ) {
          this.cycleMode();
        } else {
          this.selectItem(item);
        }
    }
  };

  onLongPress = item => {
    vibrate();

    switch (this.getCurrentMode()) {
      case ModeTypes.BROWSER:
        this.cycleMode();
        this.selectItem(item);
        break;
      default:
        this.narrowToNode(item);
    }
  };

  onPressIn = item => {
    this.lastTouchedNode = item;
    // console.tron.log(this.lastLeftFlingeGesture);
  };

  onTwoFingersPress = ({ nativeEvent }) => {
    // console.tron.log(nativeEvent.numberOfPointers)
    if (nativeEvent.numberOfPointers === 2) {
      this.touchType = "twoFingers";
    }
  };

  cycleMode = () => {
    const cm = this.getCurrentMode();
    switch (cm) {
      case ModeTypes.AGENDA:
        this.props.canOutline
          ? this.setMode(ModeTypes.OUTLINE)
          : this.setMode(ModeTypes.BROWSER);
        break;
      case ModeTypes.OUTLINE:
        // this.props.canOutline
        this.setMode(ModeTypes.AGENDA);
        // : this.setMode(ModeTypes.BROWSER);
        break;
      case ModeTypes.BROWSER:
        this.setMode(ModeTypes.AGENDA);
        break;
    }
  };

  setMode(mode) {
    this.setState({
      mode
    });
  }

  getCurrentMode() {
    // return this.props.mode;
    return this.state.mode;
  }

  renderNode(props) {
    const { item } = props;
    return (
      <TouchableHighlight
        underlayColor={"white"}
        onPressIn={() => this.onPressIn(item)}
        onPress={() => this.onPress(item)}
        onLongPress={() => this.onLongPress(item)}
        // onPressOut={() => console.tron.log("PRESSout")}
      >
        <OrgNodePerformant
          selected={!!this.state.selected.get(this.getKeyExtractor()(item))}
          item={item}
          flat={this.props.flat}
          heights={this.cache}
          files={this.props.files}
          hideAgenda={this.props.hideAgenda}
          showCategory={this.props.showCategory}
          now={moment()}
        />
      </TouchableHighlight>
    );
  }

  componentWillMount() {
    this.time = new Date();
  }

  componentWillUnmount() {
    this._unregisterNavigationEvents();
  }

  async componentDidMount() {
    // await this._recalculateCache();
    // console.tron.warn("List did mount " + (new Date() - this.time));
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.mode != this.state.mode && this.state.selected.size > 0) {
      // FIXME do not show menu on every update, instead check if menu is already shown
      this.showModeMenu(this.getCurrentMode());
    }
    if (prevProps.data != this.props.data) {
      this._recalculateCache();
    }
    // if (prevState.mode !== this.getCurrentMode()) {
    //   console.tron.log('mode changed')
    //   switch (this.state.mode) {
    //   case ModeTypes.AGENDA:
    //     this.setBatchEditMenu()
    //     break;
    //   case ModeTypes.OUTLINE:
    //     this.setOutlineMenu()
    //     break

    //   default:
    //   }
    // }
  }

  renderSectionHeader = ({ section: { title } }) => {
    return (
      <View style={{ marginBottom: 8 }}>
        <SectionListHeader title={title} />
      </View>
    );
    return (
      <Text
        style={
          this.props.stickySectionHeadersEnabled
            ? styles.listStickedSectionText
            : styles.listSectionTextnodeId
        }
      >
        {title}
      </Text>
    );
  };

  getKeyExtractor() {
    return this.props.keyExtractor || nodeKeyExtractor;
  }

  getItemLayout = (data, index) => {
    const length = this.cache[data[index].id];
    const offset = this.offsets[index];
    return {
      length,
      offset,
      index
    };
  };

  async _recalculateCache() {
    if (!this.props.data || !this.props.data.length) {
      // console.tron.warn("No data to calc cache");
      return;
    }
    let cache = {};
    const baseLevel = this.props.data[0].baseLevel || 1;
    for (var level = 1; level < 4; level++) {
      const width =
        Dimensions.get("window").width -
        Metrics.doubleBaseMargin * 2 -
        (level - baseLevel) * 28 -
        10;
      const nodes = this.props.data.filter(node => node.level === level);
      const texts = nodes.map(
        node =>
          "   " +
          (node.todo != null ? node.todo + " " : "") +
          node.headline +
          (node.tags.length > 0 ? " :" + node.tags.join(":") + ":" : "")
      );
      const fontSize = 17;

      const heights = await MeasureText.measure({
        texts,
        width,
        fontSize,
        fontFamily: "Avenir-Book"
      });
      const ids = nodes.map(node => node.id);
      for (var i = 0; i < ids.length; i++) {
        cache[ids[i]] = heights[i] + Metrics.doubleBaseMargin + 3;
      }
    }

    this.cache = cache;
    this.offsets = [1];
    for (var i = 1; i < this.props.data.length; i++) {
      this.offsets[i] =
        this.offsets[i - 1] + this.cache[this.props.data[i - 1].id] + 1;
    }

    console.tron.log("RECALCULATED");
  }

  render() {
    const { header, ...props } = this.props;
    let settings = {};
    let ListComponent;
    if (this.props.useFlatList) {
      settings = {
        getItemLayout: this.getItemLayout,
        data: this.props.data
      };
      ListComponent = FlatList;
    } else {
      ListComponent = SectionList;
      settings = {
        sections: this.props.data,
        onViewableItemsChanged: ({ viewableItems }) => {
          const currentSectionTitle = viewableItems[0].section.title;
          if (currentSectionTitle !== this.currentSectionTitle)
            this.currentSectionTitle = currentSectionTitle;
        }
      };
    }

    return (
      <FlingGestureHandler
        direction={Directions.RIGHT}
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.state === State.ACTIVE) {
            this.lastRightFlingeGesture = new Date();
            vibrate(30);
          }
        }}
      >
        <FlingGestureHandler
          direction={Directions.LEFT}
          onHandlerStateChange={({ nativeEvent }) => {
            if (nativeEvent.state === State.ACTIVE) {
              this.lastLeftFlingeGesture = new Date();
              vibrate(30);
            }
          }}
        >
          <TapGestureHandler
            onHandlerStateChange={this.onTwoFingersPress}
            minPointers={2}
            maxDurationMs={120}
            // ref={this.doubleTapRef}
            // numberOfTaps={2}
          >
            <ListComponent
              ref={this.listView}
              maxToRenderPerBatch={12}
              windowSize={5}
              updateCellsBatchingPeriod={200}
              renderItem={this.renderNode.bind(this)}
              renderSectionHeader={
                this.props.renderSectionHeader || this.renderSectionHeader
              }
              initialNumToRender={12}
              extraData={this.state}
              keyExtractor={this.getKeyExtractor()}
              ListHeaderComponent={header}
              ItemSeparatorComponent={Separator}
              {...props}
              {...settings}
            />
          </TapGestureHandler>
        </FlingGestureHandler>
      </FlingGestureHandler>
    );
  }
}

OrgNodesList.propTypes = {
  // loadedNodesData: PropTypes.object.isRequired,
  runNodeAction: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  navigationStack: PropTypes.string.isRequired
};

const mapStateToProps = R.applySpec({
  files: OrgDataSelectors.getFiles
});

export default connect(mapStateToProps, null, null, { withRef: true })(
  OrgNodesList
);
