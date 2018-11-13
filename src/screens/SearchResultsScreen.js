import { Dimensions, InteractionManager, Text, View } from "react-native";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import R from "ramda";
import React, { Component } from "react";

import { Colors, Fonts } from "../themes";
import {
  NavigatorStyle,
  NavigatorStyleAlternative,
  NavigatorStyleDupa
} from "../themes/ApplicationStyles";
import { getFileTitle } from "../utils/files";
import BusyScreen from "../components/BusyScreen";
import EmptyList from "../components/EmptyList";
import OrgDataRedux, { OrgDataSelectors } from "../redux/OrgDataRedux";
import OrgNodesList from "../components/OrgNodesList";
import OrgSearcherFilterRedux, {
  SearchFilterSelectors
} from '../redux/OrgSearcherFilterRedux';
import OrgSearcherRedux, {
  OrgSearcherSelectors
} from "../redux/OrgSearcherRedux";
import messages from "../messages";

// * Functions

const groupByFile = (nodesList, files) =>
  R.pipe(
    R.groupWith((a, b) => a.fileId === b.fileId),
    R.map(fileGroup => ({
      title: getFileTitle(files[fileGroup[0].fileId]),
      data: fileGroup
    }))
  )(nodesList);

// * Components

// ** SearchStatus

// const SearchStatus = props => {
//   return (
//     <View
//       style={[
//         styles.secondaryBackground,
//         { flexDirection: "row", justifyContent: "space-between" }
//       ]}
//     >
//       <Text style={styles.normalText}>
//         {props.searchResults.length} items found.
//       </Text>
//       <TouchableOpacity onPress={props.toggleSearchPanel}>
//         <Icon name="chevron-down" style={styles.closeButton} />
//       </TouchableOpacity>
//     </View>
//   );
// };

// SearchStatus.propTypes = {};

// * SearchResultsScreen

class SearchResultsScreen extends Component {
  static navigatorStyle = {
    // navBarButtonColor: Colors.magenta,
    // navBarHideOnScroll: true,
    // ...NavigatorStyle

    ...NavigatorStyleDupa,
    // navBarHidden: true,
    drawUnderNavBar: false,
    drawUnderTabBar: false
  };

  static defaultProps = {
    title: "Search Results",
    subtitle: "unsaved"
  };

  showMenu = () => {
    // this.clearTitle();
    this.props.navigator.setTitle({
      title: this.props.title
    });
    this.props.navigator.setSubTitle({
      subtitle: this.props.queryName || 'Unsaved'
    });
    this.props.navigator.setButtons({
      leftButtons: [],
      rightButtons: [
        // {
        //   icon: this.props.icons[11],
        //   id: "up"
        // },
        // {
        //   icon: this.props.icons[12],
        //   id: "down"
        // },
        {
          icon: this.props.icons[29],
          id: "save"
        }
      ]
    });
    this.props.navigator.setStyle({
      navBarBackgroundColor: Colors.cyan
    });
  };
  // static createNavigatorButtons = (icons, defaultStyles) => ({
  //   rightButtons: [
  //     {
  //       icon: icons[11],
  //       id: "up"
  //     },
  //     {
  //       icon: icons[12],
  //       id: "down"
  //     },
  //     {
  //       icon: icons[10],
  //       id: "save"
  //     }
  //   ]
  // })

  constructor(props) {
    super(props);
    this._unregisterNavigationEvents = this.props.navigator.addOnNavigatorEvent(
      this.onNavigatorEvent.bind(this)
    );
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.search(this.props.searchQuery);
    });

    this.showMenu();
    this.props.visitPlace(true, true, "searchResults");
  }

  onNavigatorEvent(event) {
    if (event.id && (event.id === "contextualMenuDismissed")) return
    if (event.type === "DeepLink") {
      const res = event.link.split("/");
      const [route, fileId, nodeId] = res;
      if (route !== "search") return;

      if (!nodeId) return;

      const props = {
        screen: "OrgFileBrowserScreen",
        passProps: {
          fileId,
          nodeId,
          foldingLevel: 1,
          contentFoldingLevel: 1,
          navigationStack: "search"
        }
      };
      this.props.navigator.push(props);
      return;
    }

    switch (event.id) {
      case "save":
        this.props.save();
        break;

      case "bottomTabReselected":
        this.props.navigator.pop();
        break;
      case "willAppear":
        // Update screen if data was changed on other screens
        this.props.visitPlace(undefined, undefined, "search");
        break;
      default:
        if (!this.nodesList) return;
        if (event.id) {
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
  }

  componentWillUnmount() {
    this._unregisterNavigationEvents();
  }

  componentDidUpdate() {
    this.props.navigator.setSubTitle({
      subtitle: this.props.queryName || 'Unsaved'
    });
  }

  isReady() {
    return this.props.isDataLoaded;
    // return Boolean(this.props.searchResults.length > 0);
  }

  getData() {
    const nodes = this.props.loadedNodesIds.map(
      id => this.props.loadedNodesData[id]
    );
    const data = groupByFile(nodes, this.props.files);
    return data;
  }

  renderEmptySearch() {
    return <Text>Nothing was found.</Text>;
  }

  render() {
    console.tron.log("render search results");
    const data = this.getData();
    return (
      <BusyScreen isBusy={!this.isReady()}>
        <OrgNodesList
          stickySectionHeadersEnabled
          useSectionList
          flat
          // mode='browser'
          data={data}
          navigator={this.props.navigator}
          runNodeAction={this.props.runNodeAction}
          {...this.props}
          ref={view => {
            this.nodesList = view !== null ? view.getWrappedInstance() : null;
          }}
          navigationStack="search"
          dataStack="searchResults"
          dismissEditMenu={this.showMenu}
          ListEmptyComponent={
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
                height: Dimensions.get("window").height / 2
              }}
            >
              <Text
                style={{
                  color: Colors.button,
                  fontSize: Fonts.size.h4
                }}
              >
                Nothing was found
              </Text>
            </View>
          }
        />
      </BusyScreen>
    );
  }
}

SearchResultsScreen.propTypes = {
  // searchResults: PropTypes.arrayOf(Object).isRequired,
  search: PropTypes.func.isRequired,
  searchQuery: PropTypes.object.isRequired
};

// const mapStateToProps = R.applySpec({
//   searchResults: OrgDataSelectors.getSearchResults,
//   files: OrgDataSelectors.getFiles,
//   mode: OrgDataSelectors.getMode
// });

const mapStateToProps = (state, ownProps) => ({
  files: OrgDataSelectors.getFiles(state),
  // searchResults: OrgDataSelectors.getSearchResults,
  loadedNodesData: OrgDataSelectors.getNodes(state),
  loadedNodesIds: OrgDataSelectors.getLoadedNodesIds(state)["searchResults"],
  // visitedNodeId: OrgDataSelectors.getVisitedNodeId(state),
  isDataLoaded: OrgDataSelectors.isDataLoaded(state)[ownProps.navigationStack],
  queryName: SearchFilterSelectors.getQueryName(state),
  mode: OrgDataSelectors.getMode(state)
});

const mapDispatchToProps = {
  search: OrgSearcherRedux.search,
  save: OrgSearcherFilterRedux.saveSearchQueryRequest,
  runNodeAction: OrgDataRedux.runNodeAction,
  visitPlace: OrgDataRedux.visitPlace,
  // openFileRequest: OrgDataRedux.openFileRequest,
  updateNode: OrgDataRedux.updateNode,
  cycleMode: OrgDataRedux.cycleMode,
  setMode: OrgDataRedux.setMode,

  runNodeAction: OrgDataRedux.runNodeActionRequest
};

export default connect(mapStateToProps, mapDispatchToProps)(
  SearchResultsScreen
);
