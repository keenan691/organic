// * OrgFileBrowserScreen.tsx

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
import { Animated, Text, View } from 'react-native';
import { SharedElementTransition } from 'react-native-navigation';
import { connect } from 'react-redux';
import Breadcrumbs from '../components/Breadcrumbs';
import BusyScreen from '../components/BusyScreen';
import OrgContent from '../components/OrgContent';
import { AgendaDisplayLong } from '../components/AgendaDisplayLong';
import OrgNodesList, { OrgNodesListItem } from '../containers/OrgNodesList';
import { TouchableHeadline } from '../components/TouchableHeadline';
import { getFileTitle } from '../funcs';
import { addOrgElement } from '../navigation';
import CaptureRedux, { CaptureSelectors } from '../redux/CaptureRedux';
import OrgDataRedux, { OrgDataSelectors } from '../redux/OrgDataRedux';
import {
  findNextNodeSameLevel,
  findPrevNodeSameLevel,
  getDescendantsIds,
} from '../redux/OrgDataRedux/Helpers';
import OrgSearcherFilterRedux from '../redux/OrgSearcherFilterRedux';
import OrgSearcherRedux from '../redux/OrgSearcherRedux';
import { Metrics } from '../themes';
import { NavigatorStyleDupa } from '../themes/ApplicationStyles';
import { vibrate } from '../vibrations';
import OrgFileBrowserNavBar from '../containers/OrgFileBrowserNavBar';
import styles, {
  HEADER_MAX_HEIGHT,
  HEADER_MIN_HEIGHT,
  HEADER_SCROLL_DISTANCE,
} from './styles/OrgFileBrowserScreenStyles';
import { TasksSummary } from '../components/TasksSummary';

// ** Shape
// ** Lenses

const overVisibleNodesIds = R.over(R.lensProp('visibleNodesIds'));
const getVisibleNodesIds = R.view(R.lensProp('visibleNodesIds'));
const getNodesData = R.view(R.lensProp('loadedNodesData'));

// ** Selectors

const getVisitedNode = (props) =>
  props.loadedNodesData && props.nodeId
    ? props.loadedNodesData[props.nodeId]
    : undefined;

const isVisitingNode = (props) => Boolean(getVisitedNode(props));

const withNodes = (fun) =>
  R.converge(fun, [
    R.identity,
    getNodesData,
    getVisitedNode,
    getVisibleNodesIds,
    R.prop('loadedNodesIds'),
  ]);

const mapIdsToNodes: OrgNodesListItem[] = withNodes(
  (props, nodes, visitedNode, visibleNodesIds, loadedNodesIds) => {
    const baseLevel = visitedNode ? visitedNode.level + 1 : 1;
    return R.pipe(
      overVisibleNodesIds(
        R.addIndex(R.map)((id) => {
          const node = nodes[id];
          const visibilityLevel =
            R.propOr(0, 'level', visitedNode) + props.foldingLevel;
          return {
            ...node,
            hasHiddenChildren:
              node.hasChildren && node.level === visibilityLevel,
            flat: visitedNode && node.level === visitedNode.level + 1,
            baseLevel,
          };
        }),
      ),
      getVisibleNodesIds,
    )(props);
  },
);

const narrowNodesToChildren = withNodes((props, nodes, visitedNode) =>
  overVisibleNodesIds(
    R.pipe(
      R.dropWhile((id) => id != visitedNode.id),
      R.drop(1),
      R.takeWhile((id) => nodes[id].level > visitedNode.level),
    ),
    props,
  ),
);

const getVisibleNodes = withNodes((props, nodes, visitedNode) => {
  const level = visitedNode
    ? visitedNode.level + props.foldingLevel
    : props.foldingLevel;
  return overVisibleNodesIds(
    R.filter(
      (id) => nodes[id].level <= level || props.addedNodesIds.includes(id),
    ),
    props,
  );
});

const getParentsIds = (props) => {
  const { nodeId, loadedNodesIds, loadedNodesData } = props;
  if (!nodeId) {
    return [];
  }
  return R.pipe(
    R.takeWhile(R.complement(R.equals(nodeId))),
    R.reverse,
    R.reduce(
      (acc, id) => {
        const level = loadedNodesData[id].level;

        const lastLevel = loadedNodesData[R.last(acc)].level;
        if (level < lastLevel) {
          acc.push(id);
          if (level === 1) {
            return R.reduced(acc);
          }
        }
        return acc;
      },
      [nodeId],
    ),
    R.drop(1),
    R.reverse,
  )(loadedNodesIds);
};

// ** Get Data

const prepareNodes = (props) => {
  const results = R.pipe(
    R.assoc('visibleNodesIds', props.loadedNodesIds),
    getVisibleNodes,
    R.when(isVisitingNode, R.pipe(narrowNodesToChildren)),
    mapIdsToNodes,
  )(props);
  return results;
};

// ** Screen

class OrgFileBrowserScreen extends Component {
  static navigatorStyle = {
    ...NavigatorStyleDupa,
    navBarHidden: true,
    drawUnderNavBar: true,
    drawUnderTabBar: false,
  };

  constructor(props) {
    super(props);
    this._unregisterNavigationEvents = this.props.navigator.addOnNavigatorEvent(
      this.onNavigatorEvent,
    );
    this.updateScreenWhenVisible = false;
    const { foldingLevel, contentFoldingLevel, nodeId } = props;

    this.state = {
      foldingLevel,
      contentFoldingLevel,
      nodeId,
      addedNodesIds: [],
      scrollY: new Animated.Value(0),
    };
  }

  addElement(props) {
    addOrgElement(this.props.navigator, {
      ...props,
      navigationStack: this.props.navigationStack,
    });
  }

  componentDidMount() {
    // BUG with shared transitions wihih not triggers events
    this.props.visitPlace(
      this.props.fileId,
      this.state.nodeId,
      this.props.navigationStack,
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
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.loadedNodesIds.length === 0 || !this.props.isDataLoaded) {
      return;
    }

    // Update visible node with added nodes
    if (this.props.loadedNodesIds != nextProps.loadedNodesIds) {
      const ids = R.difference(
        nextProps.loadedNodesIds,
        this.props.loadedNodesIds,
      );
      this.setState({
        addedNodesIds: R.concat(this.state.addedNodesIds, ids),
      });
    }
  }

  componentWillUnmount() {
    this._unregisterNavigationEvents();
  }

  getCurrentFileData() {
    return this.props.loadedFileData[this.props.fileId];
  }

  getData() {
    // check if  nodes are loaded if not use toc
    // or copy toc to browser redux ?

    console.tron.log('getData - orgbrowser - założyć reselector');
    return prepareNodes({ ...this.props, ...this.state });
  }

  getNodes() {
    return this.props.loadedNodesIds.map(
      (id) => this.props.loadedNodesData[id],
    );
  }

  getProps() {
    return {
      ...this.props,
      nodeId: this.state.nodeId,
    };
  }

  getVisitedNode() {
    return this.props.loadedNodesData[this.props.nodeId];
  }

  isPlaceMarked = () => {
    if (this.props.nodeId) {
      return this.getVisitedNode().tags.includes('PIN');
    }
    return false;
  };

  isReady() {
    // TOC is already loaded
    return this.isTOC() ? true : this.props.isDataLoaded;
  }

  isTOC() {
    return this.state.nodeId === undefined;
  }

  loadFile() {
    this.props.openFileRequest(this.props.fileId);
  }

  markAsSink = () => {
    const node = this.getVisitedNode();
    let props = {
      fileId: this.props.fileId,
    };
    if (node) {
      props = R.merge(
        {
          headline: node.headline,
        },
        props,
      );
    }

    this.props.addCaptureTemplate({ target: props });
  };

  move(direction) {
    // Moves thru tree structure in current screen
    // Change state of nodeId
    const { loadedNodesIds, loadedNodesData } = this.props;
    let nodeId;
    switch (direction) {
      case 'down':
        nodeId = findNextNodeSameLevel({
          nodeId: this.state.nodeId,
          nodes: loadedNodesData,
        })(loadedNodesIds);
        break;
      case 'up':
        nodeId = findPrevNodeSameLevel({
          nodeId: this.state.nodeId,
          nodes: loadedNodesData,
        })(loadedNodesIds);
        break;
      case 'left':
        nodeId = R.last(
          getParentsIds({ ...this.props, nodeId: this.state.nodeId }),
        );
        break;
    }
    if (!nodeId) {
      return;
    }
    this.props.visitPlace(
      this.props.fileId,
      nodeId,
      this.props.navigationStack,
    );

    this.setState((state) => ({ nodeId }));
  }

  onNavigatorEvent = (event) => {
    const {
      navigator,
      fileId,
      nodeId,
      visitedFileId,
      visitedNodeId,
    } = this.props;

    const targetFile = this.getCurrentFileData();
    let targetNode = this.props.loadedNodesData[nodeId];
    const navigationStack = this.props.navigationStack;

    switch (event.type) {
      case 'NavBarButtonPress':
        switch (event.id) {
          case 'addHeadline':
            if (this.nodesList.state.selected.size === 1) {
              targetNode = this.props.loadedNodesData[
                Array.from(this.nodesList.state.selected)[0][0]
              ];
            }
            this.addElement({ type: 'addHeadline', targetNode, targetFile });
            break;

          default:
            if (event.id && event.id !== 'contextualMenuDismissed') {
              const selectedNodesIds = Array.from(
                this.nodesList.state.selected.keys(),
              );
              const node =
                selectedNodesIds.length === 1
                  ? this.props.loadedNodesData[selectedNodesIds[0]]
                  : undefined;

              switch (event.id) {
                case 'delete':
                  this.props.runNodeAction(
                    event.id,
                    selectedNodesIds,
                    this.props.navigator,
                    node,
                    this.props.dataStack || this.props.navigationStack,
                    this.nodesList.clearSelection,
                  );
                  break;
                default:
                  this.props.runNodeAction(
                    event.id,
                    selectedNodesIds,
                    this.props.navigator,
                    node,
                    this.props.dataStack || this.props.navigationStack,
                  );
                  break;
              }
            }
        }
        break;
    }
    switch (event.id) {
      case 'bottomTabReselected':
        navigator.popToRoot();
        break;

      case 'willAppear':
        // Update screen if nodes was changed on other screens
        this.props.visitPlace(
          this.props.fileId,
          this.state.nodeId,
          this.props.navigationStack,
        );

        if (this.updateScreenWhenVisible === true) {
          this.forceUpdate();
        }

        break;
      case 'didAppear':
    }
  };

  render() {
    console.tron.log('browser rendereds');

    this.visibleNodes = this.getData();

    const NodeVisitorProps = {
      header: this.renderNodeHeader.bind(this),
    };

    // Its used to render file headline outside of flatlist due to shared transition works
    const TOCprops = {
      onScroll: Animated.event([
        { nativeEvent: { contentOffset: { y: this.state.scrollY } } },
      ]),
      contentContainerStyle: styles.scrollViewContent,
      scrollEventThrottle: 30,
      style: { flex: 1 },
    };

    const additionalProps = this.isTOC() ? TOCprops : NodeVisitorProps;

    return (
      <BusyScreen isBusy={!this.isReady()}>
        <View style={styles.container}>
          <OrgNodesList
            useFlatList={true}
            canOutline={true}
            navBarHidden={true}
            data={this.visibleNodes}
            navigator={this.props.navigator}
            runNodeAction={this.props.runNodeAction}
            {...this.props}
            {...additionalProps}
            ref={(view) => {
              this.nodesList = view !== null ? view.getWrappedInstance() : null;
            }}
            foldingLevel={this.state.foldingLevel}
          />
          {this.isTOC() ? this.renderAnimatedHeader() : null}
        </View>
      </BusyScreen>
    );
  }

  renderAnimatedHeader() {
    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        {this.renderFileHeader()}
      </Animated.View>
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
            { marginTop: Metrics.doubleBaseMargin },
          ]}
        >
          <SharedElementTransition
            sharedElementId={'FileId' + this.props.fileId}
            showDuration={400}
            hideDuration={200}
            showInterpolation={{
              type: 'linear',
              easing: 'FastOutSlowIn',
            }}
            hideInterpolation={{
              type: 'linear',
              easing: 'FastOutSlowIn',
            }}
          >
            <Text style={[styles.fileTitle]}>{fileTitle}</Text>
          </SharedElementTransition>
        </View>
      </View>
    );
  }

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

  renderNodeContent() {
    const node = this.props.loadedNodesData[this.state.nodeId];
    if (!node || !node.content) {
      return null;
    }
    return (
      <View style={[{ marginTop: Metrics.baseMargin }]}>
        <OrgContent content={node.content} />
      </View>
    );
  }

  renderNodeHeader() {
    const node = this.props.loadedNodesData[this.state.nodeId];
    const fileTitle = getFileTitle(this.getCurrentFileData());
    const parentItems = getParentsIds(this.getProps()).map(
      (id) => this.props.loadedNodesData[id],
    );
    const descendantsIds = getDescendantsIds(this.getProps());
    return (
      <View>
        {this.renderNavbar()}
        <Breadcrumbs
          styles={{
            padding: Metrics.doubleBaseMargin,
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
              paddingBottom: Metrics.smallMargin,
            },
          ]}
        >
          <TouchableHeadline
            {...node}
            flat={true}
            style={styles.h0}
            onHeadlineContentPress={() =>
              this.props.runNodeAction(
                'edit',
                [this.props.nodeId],
                this.props.navigator,
                this.getVisitedNode(),
              )
            }
            onTodoPress={() =>
              this.props.runNodeAction(
                'cycleTodoState',
                [this.props.nodeId],
                this.props.navigator,
                this.getVisitedNode(),
              )
            }
            onTagsLongPress={() => {
              const query = {
                priority: {},
                isScheduled: false,
                hasDeadline: false,
                searchTerm: '',
                todos: {},
                tags: R.reduce(
                  (acc, tag) => {
                    acc[tag] = 1;
                    return acc;
                  },
                  {},
                  this.getVisitedNode().tags,
                ),
              };
              vibrate();
              this.props.loadSearchQuery({ query });
              this.props.navigator.handleDeepLink({
                link: 'search/run',
                payload: query,
              });
            }}
            onTagsPress={() =>
              this.props.runNodeAction(
                'tags',
                [this.props.nodeId],
                this.props.navigator,
                this.getVisitedNode(),
              )
            }
            onPriorityPress={() =>
              this.props.runNodeAction(
                'priority',
                [this.props.nodeId],
                this.props.navigator,
                this.getVisitedNode(),
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

  setContentFoldingLevel(val) {
    this.setState((prevProps, props) => ({
      contentFoldingLevel: val,
    }));
  }

  setFoldingLevel = (val) => {
    this.setState((prevProps, props) => ({
      foldingLevel: val,
      addedNodesIds: [],
    }));
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.nodeId != nextState.nodeId) {
      return true;
    }

    // check if stack and node are the same
    const isCurrentScreen =
      this.props.visitedNodeId[this.props.navigationStack] ===
      this.state.nodeId;

    const isChanged =
      nextProps.loadedNodesIds !== this.props.loadedNodesIds ||
      nextProps.isDataLoaded !== this.props.isDataLoaded ||
      nextProps.loadedNodesData !== this.props.loadedNodesData ||
      nextState.foldingLevel != this.state.foldingLevel ||
      nextState.mode != this.state.mode;

    if (!isChanged) {
      return false;
    }
    if (isCurrentScreen) {
      return true;
    }

    this.updateScreenWhenVisible = true;
    return false;
  }
}

// ** Redux

const mapStateToProps = (state, ownProps) => ({
  loadedFileData: OrgDataSelectors.getFiles(state),
  loadedNodesData: OrgDataSelectors.getNodes(state),
  loadedNodesIds: OrgDataSelectors.getLoadedNodesIds(state)[
    ownProps.navigationStack
  ],
  visitedNodeId: OrgDataSelectors.getVisitedNodeId(state),
  isDataLoaded: OrgDataSelectors.isDataLoaded(state)[ownProps.navigationStack],
  captureTemplates: CaptureSelectors.captureTemplates(state),
  mode: OrgDataSelectors.getMode(state),
  isSink: OrgDataSelectors.isVisitedPlaceSink(state),
});

const mapDispatchToProps = {
  visitPlace: OrgDataRedux.visitPlace,
  addCaptureTemplate: CaptureRedux.addCaptureTemplate.request,
  clearLastAddedNode: OrgDataRedux.clearLastAddedNode,
  openFileRequest: OrgDataRedux.openFileRequest,
  loadRelatedNodes: OrgDataRedux.loadRelatedNodes,
  runNodeAction: OrgDataRedux.runNodeActionRequest,
  toggleMark: OrgDataRedux.toggleMark,
  updateNode: OrgDataRedux.updateNode,
  updateLoadedNodes: OrgDataRedux.updateLoadedNodes,
  cycleMode: OrgDataRedux.cycleMode,
  setMode: OrgDataRedux.setMode,
  search: OrgSearcherRedux.search,
  loadSearchQuery: OrgSearcherFilterRedux.loadSearchQuery,
};

// * Exports

export default connect(mapStateToProps, mapDispatchToProps)(
  OrgFileBrowserScreen,
);
