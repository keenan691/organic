// * AgendaScreen starts here
// * Imports

import {
  Dimensions,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { ViewPagerAndroid } from "react-native-gesture-handler";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";
import PropTypes from "prop-types";
import R, { props } from "ramda";
import React, { PureComponent, Component } from "react";
import moment from "moment";

import { Colors } from "../themes";
import { NavigationSelectors } from "../redux/NavigationRedux";
import {
  NavigatorStyle,
  NavigatorStyleAlternative,
  NavigatorStyleDupa,
  NavigatorStyleSpecial
} from "../themes/ApplicationStyles";
import { showDatePickerDialog } from "./OrgNodeEditScreen";
import AgendaRedux, { AgendaSelectors } from "../redux/AgendaRedux";
import BusyScreen from "../components/BusyScreen";
import OrgDataRedux, { OrgDataSelectors } from "../redux/OrgDataRedux";
import OrgNodesList from "../components/OrgNodesList";
import SectionListHeader from '../components/SectionListHeader';
import Separator from "../components/Separator";
import styles, {
  AgendaTheme,
  CalendarTheme
} from "./styles/AgendaScreenStyles";

// * Buttons

const keyExtractor = item => ts => ts.nodeId + " " + ts.type;
const keyDecoder = key => key.split(" ");

const AgendaLeftButtons = icons => [
  {
    id: "changeAgenda",
    showAsAction: "always",
    icon: icons[28]
  }
];

const AgendaRightButtons = icons => [
  {
    id: "next",
    showAsAction: "always",
    icon: icons[23]
  },
  {
    id: "prev",
    showAsAction: "always",
    icon: icons[22]
  },
  {
    id: "agendaCalendar",
    showAsAction: "always",
    icon: icons[27]
  }
];

const EditActionButtons = icons => [
  {
    id: "moveToTomorrow",
    showAsAction: "always",
    icon: icons[23]
  },
  {
    id: "moveToYesterday",
    showAsAction: "always",
    icon: icons[22]
  },
  // {
  //   id: "edit",
  //   showAsAction: "always",
  //   icon: icons[24]
  // }
];

// * Agenda functions

const getDayLabel = item => item;

const generateEmptyAgenda = (start, end) => {
  const date = moment(start);
  const dates = [];
  const dayNames = [];
  end = moment(end);
  do {
    dates.push(date.format("YYYY-MM-DD"));
    // dayNames.push(date.format("dddd"));
    date.add(1, "d");
  } while (!date.isAfter(end, "day"));
  return dates;
  return {
    dates,
    dayNames
  };
};

// * Screen

class AgendaScreen extends Component {
  static navigatorStyle = {
    // navBarHidden: true,
    // ...NavigatorStyleAlternative
    ...NavigatorStyleDupa,
    // navBarHidden: true,
    drawUnderNavBar: false,
    drawUnderTabBar: false,
    topBarElevationShadowEnabled: true,
  };

  static defaultProps = {
    agendaType: "week"
  };
  static createNavigatorButtons = (icons, defaultStyles) => ({
    // leftButtons: [],

    fab: {
      collapsedId: "addToAgenda",
      collapsedIcon: icons[5],
      // expendedIconColor: Colors.base3,
      // expendedId: "clear",
      ...defaultStyles.fab
    }
  });

  constructor(props) {
    super(props);
    this._removeEventListeners = this.props.navigator.addOnNavigatorEvent(
      this.onNavigatorEvent.bind(this)
    );
    this.nodesLists = {};
  }

  setBadge(num) {
    // this.props.navigator.setTabBadge({
    //   badge: num, // badge value, null to remove badge
    //   badgeColor: Colors.primary // (optional) if missing, the badge will use the default color
    // });
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    const isCurrentScreen =
      nextProps.visibleScreenId === nextProps.screenInstanceID;

    const isChanged =
      nextProps.timestamps !== this.props.timestamps ||
      // nextProps.dayTimestamps !== this.props.dayTimestamps ||
      nextProps.isDataLoaded !== this.props.isDataLoaded ||
      nextProps.loadedNodesData !== this.props.loadedNodesData;
    // nextProps.mode != this.props.mode;

    if (nextProps.todayTasksCount !== this.props.todayTasksCount) {
      this.setBadge(nextProps.todayTasksCount);
    }

    // if (!isChanged) return false;
    if (isCurrentScreen && (isChanged || this.updateScreenWhenVisible)) {
      this.updateScreenWhenVisible = false;
      return true;
    } else {
      if (isChanged) this.updateScreenWhenVisible = true;
    }

    return false;
  };

  componentWillUnmount() {
    this._removeEventListeners();
  }

  onNavigatorEvent(event) {
    if (event.id && (event.id === "contextualMenuDismissed")) return

    if (event.type === "DeepLink") {
      const res = event.link.split("/");

      const [route, fileId, nodeId] = res;

      if (route !== "agenda") return;
      const day = R.pathOr(undefined, ["payload", "day"], event);

      if (nodeId) {
        const props = {
          screen: "OrgFileBrowserScreen",
          passProps: {
            fileId,
            nodeId,
            foldingLevel: 1,
            contentFoldingLevel: 1,
            navigationStack: "agenda"
          }
        };
        this.props.navigator.push(props);

      } else
      if (day) {
                this.props.navigator.switchToTab()
                this.props.navigator.popToRoot()
                this.loadDate(new Date(day))
                }
      return;
    }

    if (event.id === "bottomTabReselected") {
      this.goToToday();
    } else
      switch (event.type) {
        case "NavBarButtonPress":
          if (event.id) {
            const dayInWeek = moment(this.props.selectedDay).day()
            let selectedNodesIds = Array.from(
              this.nodesLists[dayInWeek].state.selected.keys()
            ).map(keyDecoder);

            const node =
              selectedNodesIds.length === 1
                ? R.merge(this.props.loadedNodesData[selectedNodesIds[0][0]], {
                    type: selectedNodesIds[0][1]
                  })
                : undefined;

            selectedNodesIds = selectedNodesIds.map(id => id[0]);

            switch (event.id) {
              case "prev":
                this.jump(-1);
                break;
              case "next":
                this.jump(1);
                break;
              case "agendaCalendar":
                showDatePickerDialog(
                  moment(this.props.selectedDay).toDate(),
                  this.loadDate
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
                    date: this.props.selectedDay
                  }
                );
                break;
            }
          }
      }
  }

  loadWeek = date => {
    const range = this.props.timestampsRange;
    if (!moment(date).isBetween(range.start, range.end, "day", "[]")) {
      this.props.loadWeekAgenda(date);
      return true
    }
    return false
  };

  loadDate = date => {
    const dateFormatted = moment(date).format("YYYY-MM-DD");
    this.loadWeek(date);
    this.pager.setPageWithoutAnimation(moment(date).day());
    this.props.selectDay(dateFormatted);
    this.setTitle(dateFormatted);
  };

  jump = length => {
    const currentDay = moment(this.props.selectedDay);
    const nextDay = moment(this.props.selectedDay).add(length, 'd')
    const isNewWeekLoaded = this.loadWeek(nextDay);

    if (isNewWeekLoaded) {
      // Jumps to other week
      // this.loadWeek(nextDay.toISOString());
      // FIXME this should be done in component will update
      this.pager.setPageWithoutAnimation(length === 1 ? 0 : 6);
    } else {
      // Jumps in range of current week
      console.tron.log(nextDay.day())
      this.pager.setPage(nextDay.day());
    }
    this.props.selectDay(nextDay.format("YYYY-MM-DD"));
    this.setTitle(nextDay.format("YYYY-MM-DD"));
  };

  getData() {
    console.tron.log("getData");
    const today = moment();
    const dayFormat = "YYYY-MM-DD";
    const currentDay = moment().format(dayFormat);
    const { start, end } = this.props.timestampsRange;
    const agendaDays = generateEmptyAgenda(start, end);
    // console.tron.log(agendaDays);
    const expandObjects = R.map(({ nodeId, type }) => {
      const node = this.props.loadedNodesData[nodeId];
      const timestamp = R.find(
        R.propEq("type", type),
        node.timestamps
      );
      const date = moment(timestamp.date);
      return {
        ...timestamp,
        nodeId,
        todo: node.todo,
        day: date.format(dayFormat)
      };
    });
    const groupByDay = R.groupBy(R.prop("day"));
    const mergeWithEmptyAgenda = R.merge(
      R.into({}, R.map(day => [day, []]), agendaDays)
    );

    const agendaItems = R.pipe(expandObjects, groupByDay, mergeWithEmptyAgenda)(
      this.props.timestamps
    );

    /* ------------- day agenda ------------- */

    const getWarningDays = (ts) => today.diff(ts.day, 'd')

    const dayAgendaItems = R.pipe(
      expandObjects,
      R.map(ts => ts.todo != 'DONE' ? R.assoc('warningPeriod', getWarningDays(ts), ts) : ts)
    )(this.props.dayTimestamps);

    // console.tron.warn(this.props.dayTimestamps)

    agendaItems[currentDay] = dayAgendaItems

    /* ------------- prepare days items ------------- */

    const getProp = R.propOr([]);
    const priorityEq = R.propEq("priority");
    const todoEq = R.propEq("todo");
    const typeEq = R.propEq("type");

    const sortDay = R.pipe(
      R.groupBy(
        R.cond([
          [typeEq('closed'), R.always('closed')],
          [R.anyPass([todoEq('DONE'), todoEq(null)]), R.always('thrash')],
          [typeEq('deadline'), R.always('deadline')],
          [priorityEq('A'), R.always("A")],
          [priorityEq('C'), R.always("C")],
          [R.T, R.always("others")]
        ])
      ),

      // R.evolve({
      //   others: R.sortBy(R.prop('date')),
      //   closed: R.sortBy(R.prop('date')),
      // }),

      R.converge((...props) => R.flatten(props), [
        getProp("A"),
        getProp("others"),
        getProp("C"),
        getProp("deadline"),
        getProp("closed"),
      ])
    );


    const sections = agendaDays.map((day, idx) => {

      return {
       day,
       isToday: day === currentDay,
       data: R.pipe(
                    R.map(ts => ({
                                 ...this.props.loadedNodesData[ts.nodeId],
                                 ...ts,
                                 })),
                    sortDay
                    )(agendaItems[day])
       }});

    return sections;
  }

  renderEmptyDay = () => {
    return <Text style={styles.emptyDate}>Empty date</Text>;
  };

  renderSectionFooter = ({ section }) => {
    return section.data.length > 0 ? null : this.renderEmptyDay()
   }

  renderSectionHeader = ({ section }) => {
    const day = section.day;
    const weekDay = moment(section.day).format("dddd");
    const isToday = section.isToday;

    return (
      <View style={{ marginBottom: 8 }}>
        <SectionListHeader title={weekDay} special={!isToday}/>
      </View>
    )
    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          <Text style={[isToday ? styles.todayHeader : styles.dayHeader]}>
            {weekDay}
          </Text>
          <Text style={styles.dateHeader}>{day}</Text>
        </View>
        {section.data.length === 0 ? this.renderEmptyDay() : null}
      </View>
    );
  };


  setTitle = (title) => {
    let subtitle;

    // title = "Agenda";
    const selectedDay = this.props.selectedDay
    // subtitle =
    //   "W" +
    //   moment(this.props.timestampsRange.start).week() +
    //   " " +
    //   selectedDay.fromNow();

    // this.props.navigator.setTitle({
    //   title: subtitle
    // });

      this.props.navigator.setTitle({
        title: title || selectedDay
      });
  };

  showMenu = () => {
    this.setTitle();
    this.props.navigator.setButtons({
      leftButtons: [],
      rightButtons: AgendaRightButtons(this.props.icons)
    });
    this.props.navigator.setStyle({
      navBarBackgroundColor: Colors.cyan
    });
  };

  componentDidMount() {
    // this.goToToday();
    this.setBadge(this.props.todayTasksCount);
    this.showMenu();
  }

  componentDidUpdate(prevProps) {
    this.setTitle()
  }

  goToToday() {
    // Load current week
    const today = moment();
    this.loadDate(today);
  }

  getTodaysWeekDay = () => {
    return moment().day();
  };

  selectDay = num => {
    this.setTitle()
  };

  render() {
    // return null;
    console.tron.log("render agenda");
    const data = this.getData();
    return (
        <ViewPagerAndroid
          scrollEnabled={false}
          initialPage={this.getTodaysWeekDay()}
          style={{ flex: 1 }}
          ref={view => (this.pager = view)}
          onPageSelected={this.selectDay}
        >
          {data.map((day, idx) => (
            <View key={idx}>
              <BusyScreen isBusy={!this.props.isDataLoaded}>
              <OrgNodesList
                {...this.props}
                useSectionList
                ref={view => {
                  if (view===null) return
                  this.nodesLists[idx] = view.getWrappedInstance()
                }}
                flat
                canOutline
                // ListHeaderComponent={() => <SectionListHeader title="Tuesday"/>}
                data={[day]}
                navigator={this.props.navigator}
                runNodeAction={this.props.runNodeAction}
                navigationStack="agenda"
                dataStack="agenda"
                dismissEditMenu={this.showMenu}
                renderSectionHeader={this.renderSectionHeader}
                renderSectionFooter={this.renderSectionFooter}
                flat
                hideAgenda
                showCategory
                EditActionButtons={EditActionButtons(this.props.icons)}
                keyExtractor={ts => ts.nodeId + " " + ts.type}
              />
      </BusyScreen>
            </View>
          ))}
        </ViewPagerAndroid>
    );
  }

  renderItem(item) {
    return <View style={[styles.item, { height: item.height }]} />;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split("T")[0];
  }
}

// * PropTypes

AgendaScreen.propTypes = {};

// * Redux

const mapStateToProps = (state, ownProps) => ({
  selectedDay: AgendaSelectors.getSelectedDay(state),
  loadedNodesData: OrgDataSelectors.getNodes(state),
  timestamps: OrgDataSelectors.getTimestamps(state),
  dayTimestamps: OrgDataSelectors.getDayTimestamps(state),
  timestampsRange: OrgDataSelectors.getTimestampsRange(state),
  isDataLoaded: OrgDataSelectors.isDataLoaded(state)['agenda'],
  visibleScreenId: NavigationSelectors.getVisibleScreenId(state),
  todayTasksCount: AgendaSelectors.countTodaysTasks(state)
});

const mapDispatchToProps = {
  setMode: OrgDataRedux.setMode,
  cycleMode: OrgDataRedux.cycleMode,
  runNodeAction: OrgDataRedux.runNodeActionRequest,
  loadDayAgenda: OrgDataRedux.loadDayAgenda,
  loadWeekAgenda: OrgDataRedux.loadWeekAgenda,
  selectDay: AgendaRedux.agendaSelectDay,
  loadItems: AgendaRedux.agendaLoadItems
};

// * Export

export default connect(mapStateToProps, mapDispatchToProps)(AgendaScreen);
