// * OrgFileBrowserScreen
// * Imports

import {
  Alert,
  Animated,
  Button,
  FlatList,
  InteractionManager,
  ProgressBarAndroid,
  Slider,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SharedElementTransition } from "react-native-navigation";
import { connect } from "react-redux";
import { mapProps } from "recompose";
import Icon from "react-native-vector-icons/Ionicons";
import PropTypes from "prop-types";
import R from "ramda";
import React, { Component } from "react";

import { Colors, Fonts, Metrics } from "../themes";
import {
  NavigatorStyle,
  NavigatorStyleAlternative,
  NavigatorStyleDupa
} from "../themes/ApplicationStyles";
import {
  addOrgElement,
  navigateToNextNodeSameLevel,
  navigateToOrgElement,
  navigateToPrevNodeSameLevel,
  showEditModal
} from "../navigation";
import { getFileTitle } from "../funcs";
import { orgHeadersColors } from "../themes/Colors";
import { pathToFileName } from "../utils/files";
import { vibrate } from '../vibrations';
import { withBusyScreen } from "../components/HOCs";
import Breadcrumbs from "../components/Breadcrumbs";
import BusyScreen from "../components/BusyScreen";
import CaptureRedux, { CaptureSelectors } from "../redux/CaptureRedux";
import OrgContent from "../components/OrgContent";
import OrgDataRedux, {
  OrgDataSelectors,
  findNextNodeSameLevel,
  findPrevNodeSameLevel,
  getDescendantsIds
} from "../redux/OrgDataRedux";
import OrgFileBrowserNavBar from "./OrgFileBrowserNavBar";
import OrgNodeToolbar from "../components/OrgNodeToolbar";
import OrgNodesList, {
  AgendaDisplay,
  AgendaDisplayLong,
  BatchEditActionButtons,
  EditActionButtons,
  Headline,
  ModeTypes,
  OrgNode,
  TouchableHeadline
} from "../components/OrgNodesList";
import OrgSearcherFilterRedux from "../redux/OrgSearcherFilterRedux";
import OrgSearcherRedux from "../redux/OrgSearcherRedux";
import Separator from "../components/Separator";
import styles, {
  HEADER_MAX_HEIGHT,
  HEADER_MIN_HEIGHT,
  HEADER_SCROLL_DISTANCE
} from "./styles/OrgFileBrowserScreenStyles";

// * Lenses

const overVisibleNodesIds = R.over(R.lensProp("visibleNodesIds"));
const getVisibleNodesIds = R.view(R.lensProp("visibleNodesIds"));
const getNodesData = R.view(R.lensProp("loadedNodesData"));

// * Constants
// * Selectors

const getVisitedNode = props =>
  props.loadedNodesData && props.nodeId
    ? props.loadedNodesData[props.nodeId]
    : undefined;

const isVisitingNode = props => Boolean(getVisitedNode(props));

const withNodes = fun =>
  R.converge(fun, [
    R.identity,
    getNodesData,
    getVisitedNode,
    getVisibleNodesIds,
    R.prop("loadedNodesIds")
  ]);

const mapIdsToNodes = withNodes(
  (props, nodes, visitedNode, visibleNodesIds, loadedNodesIds) => {
    const baseLevel = visitedNode ? visitedNode.level + 1 : 1;
    return R.pipe(
      overVisibleNodesIds(
        R.addIndex(R.map)(id => {
          const node = nodes[id];
          const visibilityLevel =
            R.propOr(0, "level", visitedNode) + props.foldingLevel;
          return {
            ...node,
            hasHiddenChildren:
              node.hasChildren && node.level === visibilityLevel,
            flat: visitedNode && node.level === visitedNode.level + 1,
            baseLevel
          };
        })
      ),
      getVisibleNodesIds
    )(props);
  }
);

const narrowNodesToChildren = withNodes((props, nodes, visitedNode) =>
  overVisibleNodesIds(
    R.pipe(
      R.dropWhile(id => id != visitedNode.id),
      R.drop(1),
      R.takeWhile(id => nodes[id].level > visitedNode.level)
    ),
    props
  )
);

const getVisibleNodes = withNodes((props, nodes, visitedNode) => {
  const level = visitedNode
    ? visitedNode.level + props.foldingLevel
    : props.foldingLevel;
  return overVisibleNodesIds(
    R.filter(
      id => nodes[id].level <= level || props.addedNodesIds.includes(id)
    ),
    props
  );
});

const getParentsIds = props => {
  const { nodeId, loadedNodesIds, loadedNodesData } = props;
  if (!nodeId) return [];
  return R.pipe(
    R.takeWhile(R.complement(R.equals(nodeId))),
    R.reverse,
    R.reduce(
      (acc, id) => {
        const level = loadedNodesData[id].level;

        const lastLevel = loadedNodesData[R.last(acc)].level;
        // return R.reduced([])
        if (level < lastLevel) {
          acc.push(id);
          if (level === 1) return R.reduced(acc);
        }
        return acc;
      },
      [nodeId]
    ),
    R.drop(1),
    R.reverse
  )(loadedNodesIds);
};

// * Get Data

const prepareNodes = props => {
  const results = R.pipe(
    R.assoc("visibleNodesIds", props.loadedNodesIds),
    getVisibleNodes,
    R.when(isVisitingNode, R.pipe(narrowNodesToChildren)),
    mapIdsToNodes
  )(props);
  return results;
};

// * Components

// ** OrgFileMetadataProp

const OrgFileMetadataProp = props =>
  props.value ? (
    <View>
      <Text style={styles.subtitleText}>
        <Text style={styles.label}>{props.label}: </Text>
        <Text>{props.value} </Text>
      </Text>
    </View>
  ) : null;

OrgFileMetadataProp.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string
};

// ** ContentFoldSlider

const ContentFoldSlider = props => {
  return (
    <Slider
      style={{
        flex: 1
      }}
      maximumValue={2}
      minimumValue={0}
      onSlidingComplete={props.setContentFoldingLevel}
      value={props.contentFoldingLevel}
      step={1}
    />
  );
};

ContentFoldSlider.propTypes = {
  setContentFoldingLevel: PropTypes.func.isRequired,
  contentFoldingLevel: PropTypes.number.isRequired
};

// ** VisitedOrgFileDescription

// { showFileContent ? <Text style={styles.sectionText}>{props.description}</Text> : null}
const VisitedOrgFileDescription = props => {
  // const showFileContent = props.description && props.contentFoldingLevel >= 2;
  const showFileContent = true;
  return (
    <View>
      <Text>{getFileTitle(props)}</Text>
      <View>
        <View style={{ flexDirection: "row" }}>
          <OrgFileMetadataProp
            label="CATEGORY"
            value={props.metadata.CATEGORY}
          />
          <OrgFileMetadataProp label="AUTHOR" value={props.metadata.AUTHOR} />
        </View>
      </View>
      {showFileContent ? <OrgContent content={props.description} /> : null}
    </View>
  );
};

VisitedOrgFileDescription.propTypes = {
  description: PropTypes.string.isRequired,
  metadata: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired
};
// ** Navigation

const Navigation = props => {
  return (
    <FlingGestureHandler
      numberOfPointers={1}
      direction={Directions.UP}
      onHandlerStateChange={({ nativeEvent }) => {
        if (nativeEvent.oldState === State.ACTIVE) {
          props.upHandler();
        }
      }}
    >
      <FlingGestureHandler
        numberOfPointers={1}
        direction={Directions.DOWN}
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.oldState === State.ACTIVE) {
            props.downHandler();
          }
        }}
      >
        <FlingGestureHandler
          numberOfPointers={1}
          direction={Directions.LEFT}
          onHandlerStateChange={({ nativeEvent }) => {
            if (nativeEvent.oldState === State.ACTIVE) {
              props.leftHandler();
            }
          }}
        >
          <FlingGestureHandler
            numberOfPointers={1}
            direction={Directions.RIGHT}
            onHandlerStateChange={({ nativeEvent }) => {
              if (nativeEvent.oldState === State.ACTIVE) {
              }
            }}
          >
            {props.children}
          </FlingGestureHandler>
        </FlingGestureHandler>
      </FlingGestureHandler>
    </FlingGestureHandler>
  );
};

// ** TasksSummary

const TasksSummary = ({ nodesIds, data }) => {
  const tasksIds = nodesIds.filter(id => data[id].todo !== null);
  const doneTasksIds = tasksIds.filter(id => data[id].todo === "DONE");
  const progress = doneTasksIds.length / tasksIds.length;
  if (tasksIds.length === 0) return null;
  return (
    <View style={styles.container}>
      <View style={{}}>
        <ProgressBarAndroid
          styleAttr="Horizontal"
          color={Colors.green}
          indeterminate={false}
          progress={progress}
        />
      </View>
    </View>
  );
};

// * Screen

class OrgFileBrowserScreen extends Component {
  // nodesList = React.createRef();

  static navigatorStyle = {
    // navBarComponentAlignment: "fill",
    // navBarHideOnScroll: true,
    ...NavigatorStyleDupa,
    navBarHidden: true,
    drawUnderNavBar: true,
    drawUnderTabBar: false

    // navBarTranslucent: true // make the nav bar semi-translucent, works best with drawUnderNavBar:true
    // navBarTransparent: true
    // navBarButtonColor: Colors.white,
    // navBarBackgroundColor: Colors.cyan,
    // statusBarColor: Colors.cyan
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.loadedNodesIds.length === 0 || !this.props.isDataLoaded)
      return;

    // Update visible node with added nodes
    if (this.props.loadedNodesIds != nextProps.loadedNodesIds) {
      const ids = R.difference(
        nextProps.loadedNodesIds,
        this.props.loadedNodesIds
      );
      this.setState({
        addedNodesIds: R.concat(this.state.addedNodesIds, ids)
      });
    }
  }

  constructor(props) {
    super(props);
    this._unregisterNavigationEvents = this.props.navigator.addOnNavigatorEvent(
      this.onNavigatorEvent
    );
    this.updateScreenWhenVisible = false;
    const { foldingLevel, contentFoldingLevel, nodeId } = props;

    this.state = {
      foldingLevel,
      contentFoldingLevel,
      nodeId,
      addedNodesIds: [],
      scrollY: new Animated.Value(0)
    };
  }

  componentWillMount() {
    // If is mounting as toc copy toc info to loaded data
    // if (this.isTOC()) {
    //   const fileData = this.getCurrentFileData();
    //   this.props.updateLoadedNodes(fileData.nodesData, fileData.toc);
    // }
  }

  loadFile() {
    this.props.openFileRequest(this.props.fileId);
  }

  getVisitedNode() {
    return this.props.loadedNodesData[this.props.nodeId];
  }

  componentDidMount() {
    // BUG with shared transitions wihih not triggers events
    this.props.visitPlace(
      this.props.fileId,
      this.state.nodeId,
      this.props.navigationStack
    );

    this.time = new Date();
    if (!this.props.isDataLoaded) {
      if (this.isTOC()) {
        setTimeout(() => {
          this.props.openFileRequest(this.props.fileId);
        }, 100);
      } else {
        this.props.loadRelatedNodes(this.props.nodeId);
      }
    }
  }

  componentDidUpdate() {
    this.updateScreenWhenVisible = false;
    // if (this.props.lastAddedNodes !== null) {
    //   this.props.clearLastAddedNode();
    // }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.nodeId != nextState.nodeId) return true;

    // check if stack and node are the same
    const isCurrentScreen =
      this.props.visitedNodeId[this.props.navigationStack] ===
      this.state.nodeId;

    const isChanged =
      nextProps.loadedNodesIds !== this.props.loadedNodesIds ||
      nextProps.isDataLoaded !== this.props.isDataLoaded ||
      // nextProps.isSink !== this.props.isSink ||
      nextProps.loadedNodesData !== this.props.loadedNodesData ||
      nextState.foldingLevel != this.state.foldingLevel ||
      nextState.mode != this.state.mode;

    if (!isChanged) return false;
    if (isCurrentScreen) return true;

    this.updateScreenWhenVisible = true;
    return false;
  }

  componentWillUnmount() {
    this._unregisterNavigationEvents();
  }

  addElement(props) {
    addOrgElement(this.props.navigator, {
      ...props,
      navigationStack: this.props.navigationStack
    });
  }

  onNavigatorEvent = event => {
    const {
      navigator,
      fileId,
      nodeId,
      visitedFileId,
      visitedNodeId
    } = this.props;

    const targetFile = this.getCurrentFileData();
    let targetNode = this.props.loadedNodesData[nodeId];
    const navigationStack = this.props.navigationStack;

    switch (event.type) {
      case "NavBarButtonPress":
        switch (event.id) {
          case "addHeadline":
            if (this.nodesList.state.selected.size === 1) {
              targetNode = this.props.loadedNodesData[
                Array.from(this.nodesList.state.selected)[0][0]
              ];
            }
            this.addElement({ type: "addHeadline", targetNode, targetFile });
            break;

          default:
            if (event.id && event.id !== "contextualMenuDismissed") {
              const selectedNodesIds = Array.from(
                this.nodesList.state.selected.keys()
              );
              const node =
                selectedNodesIds.length === 1
                  ? this.props.loadedNodesData[selectedNodesIds[0]]
                  : undefined;

              switch (event.id) {
                case "delete":
                  this.props.runNodeAction(
                    event.id,
                    selectedNodesIds,
                    this.props.navigator,
                    node,
                    this.props.dataStack || this.props.navigationStack,
                    this.nodesList.clearSelection
                  );
                  break;
                default:
                  this.props.runNodeAction(
                    event.id,
                    selectedNodesIds,
                    this.props.navigator,
                    node,
                    this.props.dataStack || this.props.navigationStack
                  );
                  break;
              }
            }
        }
        break;
    }
    switch (event.id) {
      case "bottomTabReselected":
        navigator.popToRoot();
        break;

      case "willAppear":
        // Update screen if nodes was changed on other screens
        this.props.visitPlace(
          this.props.fileId,
          this.state.nodeId,
          this.props.navigationStack
        );

        if (this.updateScreenWhenVisible === true) {
          this.forceUpdate();
        }

        break;
      case "didAppear":
    }
  };

  isReady() {
    // TOC is already loaded
    return this.isTOC() ? true : this.props.isDataLoaded;
  }

  setFoldingLevel = val => {
    this.setState((prevProps, props) => ({
      foldingLevel: val,
      addedNodesIds: []
    }));
  };

  setContentFoldingLevel(val) {
    this.setState((prevProps, props) => ({
      contentFoldingLevel: val
    }));
  }

  getCurrentFileData() {
    return this.props.loadedFileData[this.props.fileId];
  }

  move(direction) {
    // Moves thru tree structure in current screen
    // Change state of nodeId
    const { loadedNodesIds, loadedNodesData } = this.props;
    let nodeId;
    switch (direction) {
      case "down":
        nodeId = findNextNodeSameLevel({
          nodeId: this.state.nodeId,
          nodes: loadedNodesData
        })(loadedNodesIds);
        break;
      case "up":
        nodeId = findPrevNodeSameLevel({
          nodeId: this.state.nodeId,
          nodes: loadedNodesData
        })(loadedNodesIds);
        break;
      case "left":
        nodeId = R.last(
          getParentsIds({ ...this.props, nodeId: this.state.nodeId })
        );
        break;
    }
    if (!nodeId) return;
    this.props.visitPlace(
      this.props.fileId,
      nodeId,
      this.props.navigationStack
    );

    this.setState(state => ({ nodeId }));
  }

  renderNodeContent() {
    const node = this.props.loadedNodesData[this.state.nodeId];
    if (!node || !node.content) return null;
    return (
      <View style={[{ marginTop: Metrics.baseMargin }]}>
        <OrgContent content={node.content} />
      </View>
    );
  }

  getProps() {
    return {
      ...this.props,
      nodeId: this.state.nodeId
    };
  }

  renderNodeHeader() {
    // console.tron.log(this.props)
    // return null
    const node = this.props.loadedNodesData[this.state.nodeId];
    const fileTitle = getFileTitle(this.getCurrentFileData());
    const parentItems = getParentsIds(this.getProps()).map(
      id => this.props.loadedNodesData[id]
    );
    const descendantsIds = getDescendantsIds(this.getProps());
    return (
      <View>
        {this.renderNavbar()}
        <Breadcrumbs
          styles={{
            padding: Metrics.doubleBaseMargin
          }}
          fileObj={this.getCurrentFileData()}
          file={fileTitle}
          nodes={parentItems}
          navigator={this.props.navigator}
          navigationStack={this.props.navigationStack}
        />

        <View
          style={[
            styles.sectionContainer,
            {
              paddingBottom: Metrics.smallMargin
            }
          ]}
        >
          <TouchableHeadline
            {...node}
            flat
            style={styles.h0}
            onHeadlineContentPress={() =>
              this.props.runNodeAction(
                "edit",
                [this.props.nodeId],
                this.props.navigator,
                this.getVisitedNode()
              )
            }
            onTodoPress={() =>
              this.props.runNodeAction(
                "cycleTodoState",
                [this.props.nodeId],
                this.props.navigator,
                this.getVisitedNode()
              )
            }
            onTagsLongPress={() => {
              const query = {
                priority: {},
                isScheduled: false,
                hasDeadline: false,
                searchTerm: "",
                todos: {},
                tags: R.reduce(
                  (acc, tag) => {
                    acc[tag] = 1;
                    return acc;
                  },
                  {},
                  this.getVisitedNode().tags
                )
              };
              vibrate()
              this.props.loadSearchQuery(query);
              this.props.navigator.handleDeepLink({
                link: "search/run",
                payload: query
              });
            }}
            onTagsPress={() =>
              this.props.runNodeAction(
                "tags",
                [this.props.nodeId],
                this.props.navigator,
                this.getVisitedNode()
              )
            }
            onPriorityPress={() =>
              this.props.runNodeAction(
                "priority",
                [this.props.nodeId],
                this.props.navigator,
                this.getVisitedNode()
              )
            }
          />
          <AgendaDisplayLong node={node} />
          <TasksSummary
            nodesIds={descendantsIds}
            data={this.props.loadedNodesData}
          />
          {this.renderNodeContent()}
        </View>
      </View>
    );
  }

  isPlaceMarked = () => {
    if (this.props.nodeId) {
      return this.getVisitedNode().tags.includes("PIN");
    }
    return false;
  };

  // toggleMark = () => {
  //   if (this.props.nodeId) {
  //     const node = this.getVisitedNode();
  //     let tags;
  //     if (node.tags.includes("PIN")) {
  //       tags = R.without(["PIN"], node.tags);
  //     } else {
  //       tags = R.concat(node.tags, ["PIN"]);
  //     }
  //     this.props.updateNode({ tags }, [this.props.nodeId]);
  //   }
  // };

  markAsSink = () => {
    const node = this.getVisitedNode();
    let props = {
      fileId: this.props.fileId
    };
    if (node)
      props = R.merge(
        {
          headline: node.headline
        },
        props
      );

    this.props.addCaptureTemplate(props);
  };

  // isSink = () => {
  //   let res;
  //   const node = this.getVisitedNode();

  //   if (this.props.nodeId) {
  //     for (var i = 0; i < this.props.captureTemplates.length; i++) {
  //       const tmp = this.props.captureTemplates[i];
  //       const { fileId, headline } = tmp.target;
  //       if (fileId === node.fileId && headline === node.headline) {
  //         res = true;
  //       }
  //     }
  //   }

  //   return res;
  // };

  renderNavbar() {
    return (
      <View>
        <OrgFileBrowserNavBar
          setFoldingLevel={this.setFoldingLevel}
          foldingLevel={this.state.foldingLevel}
          toggleMark={() => this.props.toggleMark(this.getVisitedNode())}
          isPlaceMarked={this.isPlaceMarked()}
          markAsSink={this.markAsSink}
          isSink={this.props.isSink}
          hideMark={!this.props.nodeId}
        />
      </View>
    );
  }

  renderFileHeader() {
    const fileTitle = getFileTitle(this.getCurrentFileData());
    return (
      <View>
        {this.renderNavbar()}

        <View
          style={[
            styles.sectionContainer,
            { marginTop: Metrics.doubleBaseMargin }
          ]}
        >
          <SharedElementTransition
            sharedElementId={"FileId" + this.props.fileId}
            showDuration={400}
            hideDuration={200}
            showInterpolation={{
              type: "linear",
              easing: "FastOutSlowIn"
            }}
            hideInterpolation={{
              type: "linear",
              easing: "FastOutSlowIn"
            }}
          >
            <Text style={[styles.fileTitle]}>{fileTitle}</Text>
          </SharedElementTransition>
        </View>
      </View>
    );
  }

  renderAnimatedHeader() {
    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      extrapolate: "clamp"
    });

    return (
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        {this.renderFileHeader()}
      </Animated.View>
    );
  }

  isTOC() {
    return this.state.nodeId === undefined;
  }

  getNodes() {
    return this.props.loadedNodesIds.map(id => this.props.loadedNodesData[id]);
  }

  getData() {
    // check if  nodes are loaded if not use toc
    // or copy toc to browser redux ?

    console.tron.log("getData - orgbrowser - założyć reselector");
    return prepareNodes({ ...this.props, ...this.state });
  }

  render() {
    console.tron.log("browser rendereds");

    this.visibleNodes = this.getData();

    const NodeVisitorProps = {
      header: this.renderNodeHeader.bind(this)
    };

    // Its used to render file headline outside of flatlist due to shared transition works
    const TOCprops = {
      onScroll: Animated.event([
        { nativeEvent: { contentOffset: { y: this.state.scrollY } } }
      ]),
      contentContainerStyle: styles.scrollViewContent,
      scrollEventThrottle: 30,
      style: { flex: 1 }
    };

    const additionalProps = this.isTOC() ? TOCprops : NodeVisitorProps;

    return (
      <BusyScreen isBusy={!this.isReady()}>
        <View style={styles.container}>
          <OrgNodesList
            useFlatList
            canOutline
            navBarHidden
            data={this.visibleNodes}
            navigator={this.props.navigator}
            runNodeAction={this.props.runNodeAction}
            {...this.props}
            {...additionalProps}
            ref={view => {
              this.nodesList = view !== null ? view.getWrappedInstance() : null;
            }}
            foldingLevel={this.state.foldingLevel}
          />
          {this.isTOC() ? this.renderAnimatedHeader() : null}
        </View>
      </BusyScreen>
    );
  }
}

// * Redux

const mapStateToProps = (state, ownProps) => ({
  loadedFileData: OrgDataSelectors.getFiles(state),
  loadedNodesData: OrgDataSelectors.getNodes(state),
  loadedNodesIds: OrgDataSelectors.getLoadedNodesIds(state)[
    ownProps.navigationStack
  ],
  // lastAddedNodes: OrgDataSelectors.getLastCapturedNodesIds(state),
  // visitedFileId: OrgDataSelectors.getVisitedFileId,
  visitedNodeId: OrgDataSelectors.getVisitedNodeId(state),
  isDataLoaded: OrgDataSelectors.isDataLoaded(state)[ownProps.navigationStack],
  captureTemplates: CaptureSelectors.captureTemplates(state),

  mode: OrgDataSelectors.getMode(state),
  isSink: OrgDataSelectors.isVisitedPlaceSink(state)
});

const mapDispatchToProps = {
  visitPlace: OrgDataRedux.visitPlace,
  addCaptureTemplate: CaptureRedux.addCaptureTemplateRequest,
  clearLastAddedNode: OrgDataRedux.clearLastAddedNode,
  openFileRequest: OrgDataRedux.openFileRequest,
  loadRelatedNodes: OrgDataRedux.loadRelatedNodes,
  addNode: CaptureRedux.captureRequest,
  runNodeAction: OrgDataRedux.runNodeActionRequest,
  toggleMark: OrgDataRedux.toggleMark,
  updateNode: OrgDataRedux.updateNode,
  updateLoadedNodes: OrgDataRedux.updateLoadedNodes,
  cycleMode: OrgDataRedux.cycleMode,
  setMode: OrgDataRedux.setMode,
  search: OrgSearcherRedux.search,
  loadSearchQuery: OrgSearcherFilterRedux.loadSearchQuery
};

export default connect(mapStateToProps, mapDispatchToProps)(
  OrgFileBrowserScreen
);
