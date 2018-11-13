// * SearchResultsScreen.tsx

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
import { Dimensions, InteractionManager, Text, View } from 'react-native';
import { connect } from 'react-redux';
import BusyScreen from '../components/BusyScreen';
import OrgNodesList from '../containers/OrgNodesList';
import OrgDataRedux, { OrgDataSelectors } from '../redux/OrgDataRedux';
import OrgSearcherFilterRedux, {
  SearchFilterSelectors,
} from '../redux/OrgSearcherFilterRedux';
import OrgSearcherRedux from '../redux/OrgSearcherRedux';
import { Colors, Fonts } from '../themes';
import { NavigatorStyleDupa } from '../themes/ApplicationStyles';
import { getFileTitle } from '../utils/files';

// ** Shape
// ** Helpers

const groupByFile = (nodesList, files) =>
  R.pipe(
    R.groupWith((a, b) => a.fileId === b.fileId),
    R.map((fileGroup) => ({
      title: getFileTitle(files[fileGroup[0].fileId]),
      data: fileGroup,
    })),
  )(nodesList);


// ** Screen

class SearchResultsScreen extends Component {
  static defaultProps = {
    title: 'Search Results',
    subtitle: 'unsaved',
  };
  static navigatorStyle = {
    ...NavigatorStyleDupa,
    drawUnderNavBar: false,
    drawUnderTabBar: false,
  };

  constructor(props) {
    super(props);
    this._unregisterNavigationEvents = this.props.navigator.addOnNavigatorEvent(
      this.onNavigatorEvent.bind(this),
    );
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.search(this.props.searchQuery);
    });

    this.showMenu();
    this.props.visitPlace(true, true, 'searchResults');
  }

  componentDidUpdate() {
    this.props.navigator.setSubTitle({
      subtitle: this.props.queryName || 'Unsaved',
    });
  }

  componentWillUnmount() {
    this._unregisterNavigationEvents();
  }

  getData() {
    const nodes = this.props.loadedNodesIds.map(
      (id) => this.props.loadedNodesData[id],
    );
    const data = groupByFile(nodes, this.props.files);
    return data;
  }

  isReady() {
    return this.props.isDataLoaded;
  }

  onNavigatorEvent(event) {
    if (event.id && event.id === 'contextualMenuDismissed') {
      return;
    }
    if (event.type === 'DeepLink') {
      const res = event.link.split('/');
      const [route, fileId, nodeId] = res;
      if (route !== 'search') {
        return;
      }

      if (!nodeId) {
        return;
      }

      const props = {
        screen: 'OrgFileBrowserScreen',
        passProps: {
          fileId,
          nodeId,
          foldingLevel: 1,
          contentFoldingLevel: 1,
          navigationStack: 'search',
        },
      };
      this.props.navigator.push(props);
      return;
    }

    switch (event.id) {
      case 'save':
        this.props.save();
        break;

      case 'bottomTabReselected':
        this.props.navigator.pop();
        break;
      case 'willAppear':
        // Update screen if data was changed on other screens
        this.props.visitPlace(undefined, undefined, 'search');
        break;
      default:
        if (!this.nodesList) {
          return;
        }
        if (event.id) {
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
  }

  render() {
    const data = this.getData();
    return (
      <BusyScreen isBusy={!this.isReady()}>
        <OrgNodesList
          stickySectionHeadersEnabled={true}
          useSectionList={true}
          flat={true}
          // mode='browser'
          data={data}
          navigator={this.props.navigator}
          runNodeAction={this.props.runNodeAction}
          {...this.props}
          ref={(view) => {
            this.nodesList = view !== null ? view.getWrappedInstance() : null;
          }}
          navigationStack="search"
          dataStack="searchResults"
          dismissEditMenu={this.showMenu}
          ListEmptyComponent={
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
                height: Dimensions.get('window').height / 2,
              }}
            >
              <Text
                style={{
                  color: Colors.button,
                  fontSize: Fonts.size.h4,
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

  renderEmptySearch() {
    return <Text>Nothing was found.</Text>;
  }

  showMenu = () => {
    this.props.navigator.setTitle({
      title: this.props.title,
    });
    this.props.navigator.setSubTitle({
      subtitle: this.props.queryName || 'Unsaved',
    });
    this.props.navigator.setButtons({
      leftButtons: [],
      rightButtons: [
        {
          icon: this.props.icons[29],
          id: 'save',
        },
      ],
    });
    this.props.navigator.setStyle({
      navBarBackgroundColor: Colors.cyan,
    });
  };
}

// ** Redux

const mapStateToProps = (state, ownProps) => ({
  files: OrgDataSelectors.getFiles(state),
  isDataLoaded: OrgDataSelectors.isDataLoaded(state)[ownProps.navigationStack],
  loadedNodesData: OrgDataSelectors.getNodes(state),
  loadedNodesIds: OrgDataSelectors.getLoadedNodesIds(state).searchResults,
  mode: OrgDataSelectors.getMode(state),
  queryName: SearchFilterSelectors.getQueryName(state),
});

const mapDispatchToProps = {
  cycleMode: OrgDataRedux.cycleMode,
  runNodeAction: OrgDataRedux.runNodeActionRequest,
  save: OrgSearcherFilterRedux.saveSearchQuery.request,
  search: OrgSearcherRedux.search,
  setMode: OrgDataRedux.setMode,
  updateNode: OrgDataRedux.updateNode,
  visitPlace: OrgDataRedux.visitPlace,
};

// * Exports

export default connect(mapStateToProps, mapDispatchToProps)(
  SearchResultsScreen,
);
