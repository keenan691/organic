// * AgendaScreen.tsx

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
  PlainOrgNodesDict,
  PlainOrgTimestampShort,
  TimeRange,
} from 'org-mode-connection';
import R from 'ramda';
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { ViewPagerAndroid } from 'react-native-gesture-handler';
import { Navigator } from 'react-native-navigation';
import { connect } from 'react-redux';
import BusyScreen from '../components/BusyScreen';
import SectionListHeader from '../components/SectionListHeader';
import OrgNodesList, {
  OrgNodesListAgendaItem,
} from '../containers/OrgNodesList';
import AgendaRedux, { AgendaSelectors } from '../redux/AgendaRedux';
import { NavigationSelectors } from '../redux/NavigationRedux';
import OrgDataRedux, { OrgDataSelectors } from '../redux/OrgDataRedux';
import { GlobalState } from '../redux/types';
import { Colors } from '../themes';
import { NavigatorStyleDupa } from '../themes/ApplicationStyles';
import { showDatePickerDialog } from '../utils/pickers';
import styles from './styles/AgendaScreenStyles';

// ** Shape

interface Props {
  cycleMode: () => null;
  dayTimestamps: PlainOrgTimestampShort[];
  icons: string[];
  isDataLoaded: boolean;
  loadDayAgenda: () => null;
  loadWeekAgenda: () => null;
  loadedNodesData: PlainOrgNodesDict;
  navigator: Navigator;
  runNodeAction: () => null;
  selectDay: () => null;
  selectedDay: string;
  setMode: () => null;
  timestamps: PlainOrgTimestampShort[];
  timestampsRange: TimeRange;
  todayTasksCount: number;
  visibleScreenId: string;
}

// ** Helpers

const keyDecoder = (key: string) => key.split(' ');

const generateEmptyAgenda = (start: string, end: string) => {
  const date = moment(start);
  const dates = [];
  const dayNames = [];
  end = moment(end);
  do {
    dates.push(date.format('YYYY-MM-DD'));
    date.add(1, 'd');
  } while (!date.isAfter(end, 'day'));
  return dates;
};

// ** Buttons

const AgendaRightButtons = (icons: string[]) => [
  {
    id: 'next',
    showAsAction: 'always',
    icon: icons[23],
  },
  {
    id: 'prev',
    showAsAction: 'always',
    icon: icons[22],
  },
  {
    id: 'agendaCalendar',
    showAsAction: 'always',
    icon: icons[27],
  },
];

const EditActionButtons = (icons: string[]) => [
  {
    id: 'moveToTomorrow',
    showAsAction: 'always',
    icon: icons[23],
  },
  {
    id: 'moveToYesterday',
    showAsAction: 'always',
    icon: icons[22],
  },
];

// ** Screen

class AgendaScreen extends Component<Props> {
  private pager = React.createRef<ViewPagerAndroid>();
  /* nodesList = React.createRef<Nodes>{} */

  static navigatorStyle = {
    ...NavigatorStyleDupa,
    drawUnderNavBar: false,
    drawUnderTabBar: false,
    topBarElevationShadowEnabled: true,
  };

  static defaultProps = {
    agendaType: 'week',
  };

  static createNavigatorButtons = (icons, defaultStyles) => ({
    fab: {
      collapsedId: 'addToAgenda',
      collapsedIcon: icons[5],
      ...defaultStyles.fab,
    },
  });

  constructor(props) {
    super(props);
    this._removeEventListeners = this.props.navigator.addOnNavigatorEvent(
      this.onNavigatorEvent.bind(this),
    );
    this.nodesLists = {};
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    const isCurrentScreen =
      nextProps.visibleScreenId === nextProps.screenInstanceID;

    const isChanged =
      nextProps.timestamps !== this.props.timestamps ||
      nextProps.isDataLoaded !== this.props.isDataLoaded ||
      nextProps.loadedNodesData !== this.props.loadedNodesData;

    if (isCurrentScreen && (isChanged || this.updateScreenWhenVisible)) {
      this.updateScreenWhenVisible = false;
      return true;
    } else {
      if (isChanged) {
        this.updateScreenWhenVisible = true;
      }
    }

    return false;
  };

  componentWillUnmount() {
    this._removeEventListeners();
  }

  onNavigatorEvent(event) {
    if (event.id && event.id === 'contextualMenuDismissed') {
      return;
    }

    if (event.type === 'DeepLink') {
      const res = event.link.split('/');

      const [route, fileId, nodeId] = res;

      if (route !== 'agenda') {
        return;
      }

      const day = R.pathOr(undefined, ['payload', 'day'], event);

      if (nodeId) {
        const props = {
          screen: 'OrgFileBrowserScreen',
          passProps: {
            fileId,
            nodeId,
            foldingLevel: 1,
            contentFoldingLevel: 1,
            navigationStack: 'agenda',
          },
        };
        this.props.navigator.push(props);
      } else if (day) {
        this.props.navigator.switchToTab();
        this.props.navigator.popToRoot();
        this.loadDate(new Date(day));
      }
      return;
    }

    if (event.id === 'bottomTabReselected') {
      this.goToToday();
    } else {
      switch (event.type) {
        case 'NavBarButtonPress':
          if (event.id) {
            const dayInWeek = moment(this.props.selectedDay).day();
            let selectedNodesIds = Array.from(
              this.nodesLists[dayInWeek].state.selected.keys(),
            ).map(keyDecoder);

            const node =
              selectedNodesIds.length === 1
                ? R.merge(this.props.loadedNodesData[selectedNodesIds[0][0]], {
                    type: selectedNodesIds[0][1],
                  })
                : undefined;

            selectedNodesIds = selectedNodesIds.map((id) => id[0]);

            switch (event.id) {
              case 'prev':
                this.jump(-1);
                break;
              case 'next':
                this.jump(1);
                break;
              case 'agendaCalendar':
                showDatePickerDialog(
                  moment(this.props.selectedDay).toDate(),
                  this.loadDate,
                );

                break;

              default:
                this.props.runNodeAction(
                  event.id,
                  selectedNodesIds,
                  this.props.navigator,
                  node,
                  this.props.dataStack || this.props.navigationStack,
                  undefined,
                  undefined,
                  {
                    date: this.props.selectedDay,
                  },
                );
                break;
            }
          }
      }
    }
  }

  loadWeek = (date) => {
    const range = this.props.timestampsRange;
    if (!moment(date).isBetween(range.start, range.end, 'day', '[]')) {
      this.props.loadWeekAgenda(date);
      return true;
    }
    return false;
  };

  loadDate = (date) => {
    const dateFormatted = moment(date).format('YYYY-MM-DD');
    this.loadWeek(date);
    this.pager.setPageWithoutAnimation(moment(date).day());
    this.props.selectDay({ day: dateFormatted });
    this.setTitle(dateFormatted);
  };

  jump = (length: number) => {
    const nextDay = moment(this.props.selectedDay).add(length, 'd');
    const isNewWeekLoaded = this.loadWeek(nextDay);

    if (isNewWeekLoaded) {
      // Jumps to other week
      // this.loadWeek(nextDay.toISOString());
      // FIXME this should be done in component will update
      this.pager.setPageWithoutAnimation(length === 1 ? 0 : 6);
    } else {
      // Jumps in range of current week
      this.pager.setPage(nextDay.day());
    }
    this.props.selectDay({ day: nextDay.format('YYYY-MM-DD') });
    this.setTitle(nextDay.format('YYYY-MM-DD'));
  };

  getData(): OrgNodesListAgendaItem[] {
    const { start, end } = this.props.timestampsRange;
    const agendaDays = generateEmptyAgenda(start, end);
    const dayFormat = 'YYYY-MM-DD';
    const currentDay = moment().format(dayFormat);
    const today = moment();
    const expandObjects = R.map(({ nodeId, type }) => {
      const node = this.props.loadedNodesData[nodeId];
      const timestamp = R.find(R.propEq('type', type), node.timestamps);
      const date = moment(timestamp.date);
      return {
        ...timestamp,
        nodeId,
        todo: node.todo,
        day: date.format(dayFormat),
      };
    });
    const groupByDay = R.groupBy(R.prop('day'));
    const mergeWithEmptyAgenda = R.merge(
      R.into({}, R.map((day) => [day, []]), agendaDays),
    );

    const agendaItems = R.pipe(expandObjects, groupByDay, mergeWithEmptyAgenda)(
      this.props.timestamps,
    );

    /* ------------- day agenda ------------- */

    const getWarningDays = (ts) => today.diff(ts.day, 'd');

    const dayAgendaItems = R.pipe(
      expandObjects,
      R.map(
        (ts) =>
          ts.todo != 'DONE'
            ? R.assoc('warningPeriod', getWarningDays(ts), ts)
            : ts,
      ),
    )(this.props.dayTimestamps);

    agendaItems[currentDay] = dayAgendaItems;

    /* ------------- prepare days items ------------- */

    const getProp = R.propOr([]);
    const priorityEq = R.propEq('priority');
    const todoEq = R.propEq('todo');
    const typeEq = R.propEq('type');

    const sortDay = R.pipe(
      R.groupBy(
        R.cond([
          [typeEq('closed'), R.always('closed')],
          [R.anyPass([todoEq('DONE'), todoEq(null)]), R.always('thrash')],
          [typeEq('deadline'), R.always('deadline')],
          [priorityEq('A'), R.always('A')],
          [priorityEq('C'), R.always('C')],
          [R.T, R.always('others')],
        ]),
      ),

      R.converge((...props) => R.flatten(props), [
        getProp('A'),
        getProp('others'),
        getProp('C'),
        getProp('deadline'),
        getProp('closed'),
      ]),
    );

    const sections = agendaDays.map((day, idx) => {
      return {
        day,
        isToday: day === currentDay,
        data: R.pipe(
          R.map((ts) => ({
            ...this.props.loadedNodesData[ts.nodeId],
            ...ts,
          })),
          sortDay,
        )(agendaItems[day]),
      };
    });

    return sections;
  }

  renderEmptyDay = () => {
    return <Text style={styles.emptyDate}>Empty date</Text>;
  };

  renderSectionFooter = ({ section }) => {
    return section.data.length > 0 ? null : this.renderEmptyDay();
  };

  renderSectionHeader = ({ section }) => {
    const weekDay = moment(section.day).format('dddd');
    const isToday = section.isToday;

    return (
      <View style={{ marginBottom: 8 }}>
        <SectionListHeader title={weekDay} special={!isToday} />
      </View>
    );
  };

  setTitle = (title?: string) => {
    const selectedDay = this.props.selectedDay;
    this.props.navigator.setTitle({
      title: title || selectedDay,
    });
  };

  showMenu = () => {
    this.setTitle();
    this.props.navigator.setButtons({
      leftButtons: [],
      rightButtons: AgendaRightButtons(this.props.icons),
    });
    this.props.navigator.setStyle({
      navBarBackgroundColor: Colors.cyan,
    });
  };

  componentDidMount() {
    this.showMenu();
  }

  componentDidUpdate() {
    this.setTitle();
  }

  goToToday() {
    // Loads current week
    const today = moment();
    this.loadDate(today);
  }

  getTodaysWeekDay = () => {
    return moment().day();
  };

  selectDay = () => {
    this.setTitle();
  };

  render() {
    const data = this.getData();
    return (
      <ViewPagerAndroid
        initialPage={this.getTodaysWeekDay()}
        onPageSelected={this.selectDay}
        ref={(view) => (this.pager = view)}
        scrollEnabled={false}
        style={{ flex: 1 }}
      >
        {data.map((day, idx) => (
          <View key={idx}>
            <BusyScreen isBusy={!this.props.isDataLoaded}>
              <OrgNodesList
                EditActionButtons={EditActionButtons(this.props.icons)}
                canOutline={true}
                data={[day]}
                dataStack="agenda"
                dismissEditMenu={this.showMenu}
                flat={true}
                hideAgenda={true}
                keyExtractor={(ts: PlainOrgTimestampShort) =>
                  ts.nodeId + ' ' + ts.type
                }
                navigationStack="agenda"
                navigator={this.props.navigator}
                ref={(view) => {
                  if (view === null) {
                    return;
                  }
                  this.nodesLists[idx] = view.getWrappedInstance();
                }}
                renderSectionFooter={this.renderSectionFooter}
                renderSectionHeader={this.renderSectionHeader}
                runNodeAction={this.props.runNodeAction}
                showCategory={true}
                useSectionList={true}
                {...this.props}
              />
            </BusyScreen>
          </View>
        ))}
      </ViewPagerAndroid>
    );
  }
}

// * Redux

const mapStateToProps = (state: GlobalState) => ({
  dayTimestamps: OrgDataSelectors.getDayTimestamps(state),
  isDataLoaded: OrgDataSelectors.isDataLoaded(state)['agenda'],
  loadedNodesData: OrgDataSelectors.getNodes(state),
  selectedDay: AgendaSelectors.getSelectedDay(state),
  timestamps: OrgDataSelectors.getTimestamps(state),
  timestampsRange: OrgDataSelectors.getTimestampsRange(state),
  todayTasksCount: AgendaSelectors.countTodaysTasks(state),
  visibleScreenId: NavigationSelectors.getVisibleScreenId(state),
});

const mapDispatchToProps = {
  cycleMode: OrgDataRedux.cycleMode,
  loadDayAgenda: OrgDataRedux.loadDayAgenda,
  loadWeekAgenda: OrgDataRedux.loadWeekAgenda,
  runNodeAction: OrgDataRedux.runNodeActionRequest,
  selectDay: AgendaRedux.agendaSelectDay,
  setMode: OrgDataRedux.setMode,
};

// * Export

export default connect(mapStateToProps, mapDispatchToProps)(AgendaScreen);
