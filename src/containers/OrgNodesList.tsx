// * OrgNodesList.tsx

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

import moment from 'moment';
import {
  PlainOrgNode,
  PlainOrgTimestamp,
  PlainOrgTimestampShort,
} from 'org-mode-connection';
import R from 'ramda';
import React, { Component } from 'react';
import {
  Dimensions,
  FlatList,
  SectionList,
  TouchableHighlight,
  View,
} from 'react-native';
import {
  Directions,
  FlingGestureHandler,
  TapGestureHandler,
  State,
} from 'react-native-gesture-handler';
import MeasureText from 'react-native-measure-text';
import { Navigator } from 'react-native-navigation';
import { connect } from 'react-redux';
import SectionListHeader from '../components/SectionListHeader';
import Separator from '../components/Separator';
import { navigateToOrgElement } from '../navigation';
import { OrgDataSelectors } from '../redux/OrgDataRedux';
import { runNodeAction } from '../redux/OrgDataRedux/Actions';
import { DataStack } from '../redux/types';
import { Colors, Metrics } from '../themes';
import { ContextMenuStyles } from '../themes/ApplicationStyles';
import { vibrate } from '../vibrations';
import { OrgNodePerformant } from '../components/OrgNodePerformant';

// ** Shape

type OrgNodesListDataType = OrgNodesListItem | OrgNodesListAgendaItem;

export interface OrgNodesListItem extends PlainOrgNode {
  baseLevel: number;
  flat: boolean;
  hasHiddenChildren: boolean;
  role: string;
}

export interface OrgNodesListAgendaItem extends PlainOrgTimestampShort {
  day: string;
  warningPeriod?: number;
}

export interface OrgNodeListProps {
  canOutline: boolean;
  data:
    | OrgNodesListDataType[]
    | { name: string; items: OrgNodesListDataType[] }[];
  EditActionButtons: object[];
  files: object;
  flat: boolean;
  hideAgenda: boolean;
  icons: object[];
  navigationStack: DataStack;
  navigator: Navigator;
  renderSectionHeader?: (item: object) => any;
  runNodeAction: typeof runNodeAction;
  showCategory: boolean;
  useFlatList: boolean;
}

interface OrgNodeListState {
  flinged: null;
  mode: 'outline' | 'agenda' | 'browser';
  moveMode: 'tree' | 'note';
  selected: Map;
}

// ** Const

export const ModeTypes = Object.freeze({
  OUTLINE: 'outline',
  AGENDA: 'agenda',
  BROWSER: 'browser',
});

const FLINGE_DELTA = 900;

// ** Helpers

const nodeKeyExtractor = (node: OrgNodesListItem) => node.id;

export const getHeadlineIconName = (item: OrgNodesListItem) => {
  let headlineIconName;
  switch (item.content ? item.content.split('\n').length : 0) {
    case 0:
    case 1:
      return (headlineIconName = 'ios-radio-button-off');
    case 2:
    case 3:
      return (headlineIconName = 'ios-disc-outline');
    default:
      return (headlineIconName = 'ios-disc');
  }
};

export const formatTimestamp = (ts: PlainOrgTimestamp) => {
  let res = ts.dateWithTime
    ? moment(ts.date).format('YYYY-MM-DD HH:mm')
    : moment(ts.date).format('YYYY-MM-DD');
  if (ts.repeater) {
    res = res + ' ' + ts.repeater.toUpperCase();
  }
  return res;
};

// ** Buttons

export const BatchEditActionButtons = (icons) => [
  {
    title: 'Agenda',
    id: 'agenda',
    showAsAction: 'always',
    icon: icons[27],
  },

  {
    title: 'Priority',
    id: 'priority',
    showAsAction: 'always',
    icon: icons[20],
  },
  {
    id: 'tags',
    title: 'Tags',
    showAsAction: 'always',
    icon: icons[19],
  },
  {
    title: 'Todo',
    id: 'todo',
    showAsAction: 'always',
    icon: icons[18],
  },
  {
    id: 'delete',
    showAsAction: 'always',
    icon: icons[21],
  },
];

export const EditActionButtons = (icons, moveMode) => [
  {
    id: moveMode === 'tree' ? 'moveDown' : 'moveDownNote',
    showAsAction: 'always',
    icon: icons[11],
  },
  {
    id: moveMode === 'tree' ? 'moveUp' : 'moveUpNote',
    showAsAction: 'always',
    icon: icons[12],
  },
  {
    id: moveMode === 'tree' ? 'moveRight' : 'moveRightNote',
    showAsAction: 'always',
    icon: icons[23],
  },
  {
    id: moveMode === 'tree' ? 'moveLeft' : 'moveLeftNote',
    showAsAction: 'always',
    icon: icons[22],
  },
  {
    id: moveMode === 'tree' ? 'toggleMoveNote' : 'toggleMoveTree',
    showAsAction: 'always',
    title: moveMode === 'tree' ? 'Move tree' : 'Move note',
  },
];

// ** Component

export class OrgNodesList extends Component<
  OrgNodeListProps,
  OrgNodeListState
> {
  cache = {};
  doubleTapRef = React.createRef();
  listView = React.createRef();
  offsets = {};
  state: OrgNodeListState = {
    selected: new Map(),
    moveMode: 'tree',
    mode: 'browser',
    flinged: null,
  };

  constructor(props: OrgNodeListProps) {
    super(props);
    this._unregisterNavigationEvents = this.props.navigator.addOnNavigatorEvent(
      this.onNavigatorEvent,
    );
  }

  async _recalculateCache() {
    if (!this.props.data || !this.props.data.length) {
      return;
    }

    const cache = {};
    const baseLevel = this.props.data[0].baseLevel || 1;
    for (let level = 1; level < 4; level++) {
      const width =
        Dimensions.get('window').width -
        Metrics.doubleBaseMargin * 2 -
        (level - baseLevel) * 28 -
        10;
      const nodes = this.props.data.filter((node) => node.level === level);
      const texts = nodes.map(
        (node: OrgNodesListItem) =>
          '   ' +
          (node.todo != null ? node.todo + ' ' : '') +
          node.headline +
          (node.tags.length > 0 ? ' :' + node.tags.join(':') + ':' : ''),
      );
      const fontSize = 17;

      const heights = await MeasureText.measure({
        texts,
        width,
        fontSize,
        fontFamily: 'Avenir-Book',
      });
      const ids = nodes.map((node) => node.id);
      for (let i = 0; i < ids.length; i++) {
        cache[ids[i]] = heights[i] + Metrics.doubleBaseMargin + 3;
      }
    }

    this.cache = cache;
    this.offsets = [1];
    for (let i = 1; i < this.props.data.length; i++) {
      this.offsets[i] =
        this.offsets[i - 1] + this.cache[this.props.data[i - 1].id] + 1;
    }
  }

  _unregisterNavigationEvents = () => any;

  clearSelection = () => {
    this.setState(() => ({ selected: new Map() }));
  };

  clearTitle() {
    this.props.navigator.setSubTitle({
      subtitle: '',
    });
    this.props.navigator.setTitle({
      title: '',
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.mode != this.state.mode && this.state.selected.size > 0) {
      // FIXME do not show menu on every update, instead check if menu is already shown
      this.showModeMenu(this.getCurrentMode());
    }
    if (prevProps.data != this.props.data) {
      this._recalculateCache();
    }
  }

  componentWillMount() {
    this.time = new Date();
  }

  componentWillUnmount() {
    this._unregisterNavigationEvents();
  }

  cycleMode = () => {
    const cm = this.getCurrentMode();
    switch (cm) {
      case ModeTypes.AGENDA:
        this.props.canOutline
          ? this.setMode(ModeTypes.OUTLINE)
          : this.setMode(ModeTypes.BROWSER);
        break;
      case ModeTypes.OUTLINE:
        this.setMode(ModeTypes.AGENDA);
        break;
      case ModeTypes.BROWSER:
        this.setMode(ModeTypes.AGENDA);
        break;
    }
  };

  dismissEditMenu() {
    this.props.dismissEditMenu
      ? this.props.dismissEditMenu()
      : this.props.navigator.setStyle({
          navBarHidden: true,
        });
  }

  getCurrentMode() {
    return this.state.mode;
  }

  getCurrentSectionId() {
    return R.findIndex(R.propEq('title', this.currentSectionTitle))(
      this.props.data,
    );
  }

  getItemLayout = (data, index) => {
    const length = this.cache[data[index].id];
    const offset = this.offsets[index];
    return {
      length,
      offset,
      index,
    };
  };

  getKeyExtractor() {
    return this.props.keyExtractor || nodeKeyExtractor;
  }

  narrowToNode = (item) => {
    const delta = new Date() - this.lastNavigateAction;
    if (delta < 600) {
      return;
    }

    this.lastNavigateAction = new Date();

    navigateToOrgElement(
      this.props.navigator,
      this.lastTouchedNode.fileId,
      this.lastTouchedNode.id,
      this.props.navigationStack,
    );
  };

  onLongPress = (item) => {
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

  onNavigatorEvent = (event) => {
    switch (event.id) {
      case 'contextualMenuDismissed':
        break;

      case 'toggleMoveNote':
        this.setState((state) => ({
          moveMode: 'note',
        }));
        this.setOutlineMenu();
        break;

      case 'toggleMoveTree':
        this.setState((state) => ({
          moveMode: 'tree',
        }));
        this.setOutlineMenu();
        break;

      case 'dismissMenu':
        this.dismissEditMenu();
        this.clearSelection();
        this.setState({
          mode: ModeTypes.BROWSER,
        });
        break;
    }
  };

  onPress = (item) => {
    const now = new Date();
    const cm = this.getCurrentMode();

    if (this.touchType === 'twoFingers') {
      vibrate();
      this.touchType = undefined;
      this.props.runNodeAction('edit', [item.id], this.props.navigator, item);
      return;
    }

    /* ------------- After flinge press ------------- */

    if (item.id === this.lastTouchedNode.id) {
      if (
        this.lastLeftFlingeGesture &&
        now - this.lastLeftFlingeGesture < FLINGE_DELTA
      ) {
        vibrate(30);
        this.props.runNodeAction('tags', [item.id], this.props.navigator, item);
        return;
      }
      if (
        this.lastRightFlingeGesture &&
        now - this.lastRightFlingeGesture < FLINGE_DELTA
      ) {
        vibrate(30);
        this.props.runNodeAction(
          'cycleTodoState',
          [item.id],
          this.props.navigator,
          item,
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

  onPressIn = (item) => {
    this.lastTouchedNode = item;
  };

  onTwoFingersPress = ({ nativeEvent }) => {
    if (nativeEvent.numberOfPointers === 2) {
      this.touchType = 'twoFingers';
    }
  };

  render() {
    const { header, ...props } = this.props;
    let settings = {};
    let ListComponent;
    if (this.props.useFlatList) {
      settings = {
        getItemLayout: this.getItemLayout,
        data: this.props.data,
      };
      ListComponent = FlatList;
    } else {
      ListComponent = SectionList;
      settings = {
        sections: this.props.data,
        onViewableItemsChanged: ({ viewableItems }) => {
          const currentSectionTitle = viewableItems[0].section.title;
          if (currentSectionTitle !== this.currentSectionTitle) {
            this.currentSectionTitle = currentSectionTitle;
          }
        },
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

  renderNode(props) {
    const { item } = props;
    return (
      <TouchableHighlight
        underlayColor={'white'}
        onPressIn={() => this.onPressIn(item)}
        onPress={() => this.onPress(item)}
        onLongPress={() => this.onLongPress(item)}
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

  renderSectionHeader = ({ section: { title } }) => {
    return (
      <View style={{ marginBottom: 8 }}>
        <SectionListHeader title={title} />
      </View>
    );
  };

  // scrollToNextSection() {
  //   const currentSectionId = this.getCurrentSectionId();
  //   const id =
  //     currentSectionId < this.props.data.length - 1 ? currentSectionId + 1 : 0;
  //   this.listView.current.scrollToLocation({
  //     itemIndex: 0,
  //     sectionIndex: id,
  //     viewOffset: Metrics.doubleBaseMargin * 2.37,
  //   });
  // }

  // scrollToPrevSection() {
  //   const currentSectionId = this.getCurrentSectionId();
  //   const id =
  //     currentSectionId > 0 ? currentSectionId - 1 : this.props.data.length - 1;
  //   this.listView.current.scrollToLocation({
  //     itemIndex: 0,
  //     sectionIndex: id,
  //     viewOffset: Metrics.doubleBaseMargin * 2.37,
  //   });
  // }

  selectItem = (item) => {
    const cm = this.getCurrentMode();
    const selected = new Map(this.state.selected);
    let nextMode = cm;
    const itemId = this.getKeyExtractor()(item);

    switch (cm) {
      case ModeTypes.AGENDA:
        if (selected.has(itemId)) {
          if (selected.size === 1) {
            nextMode = ModeTypes.OUTLINE;
          }
          selected.delete(itemId);
        } else {
          selected.set(itemId, true);
        }
        break;
      case ModeTypes.OUTLINE:
        if (selected.has(itemId)) {
        } else {
          selected.clear();
          selected.set(itemId, true);
        }
        break;
      case ModeTypes.BROWSER:
        selected.set(itemId, true);
        break;
    }

    this.setState((state) => {
      return { selected };
    });

    this.showModeMenu(cm);

    return selected;
  };

  setBatchEditMenu() {
    this.clearTitle();
    const batchEditButtons = BatchEditActionButtons(this.props.icons);
    this.props.navigator.setButtons({
      leftButtons: [
        {
          id: 'dismissMenu',
          showAsAction: 'always',
          icon: this.props.icons[26],
        },
      ],
      rightButtons: batchEditButtons,
    });
    this.props.navigator.setStyle({
      navBarBackgroundColor: Colors.editMenuColor,
    });
  }

  setMode(mode) {
    this.setState({
      mode,
    });
  }

  setOutlineMenu() {
    this.clearTitle();
    this.props.navigator.setButtons({
      leftButtons: [
        {
          id: 'dismissMenu',
          showAsAction: 'always',
          icon: this.props.icons[26],
        },
      ],
      rightButtons:
        this.props.EditActionButtons ||
        EditActionButtons(this.props.icons, this.state.moveMode),
    });
    this.props.navigator.setStyle(ContextMenuStyles.primary);
  }

  showModeMenu = (mode) => {
    switch (mode) {
      case 'outline':
        this.setOutlineMenu();
        break;
      case 'agenda':
        this.setBatchEditMenu();
        break;
      case 'browser':
        this.dismissEditMenu();
        break;
    }

    this.props.navigator.setStyle({
      navBarHidden: false,
    });
  };
}

// ** Redux

const mapStateToProps = R.applySpec({
  files: OrgDataSelectors.getFiles,
});

// * Exports

export default connect(mapStateToProps, null, null, { withRef: true })(
  OrgNodesList,
);
