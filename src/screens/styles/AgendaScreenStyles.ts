import { StyleSheet } from 'react-native';
import { ApplicationStyles, Colors, Fonts, Metrics } from '../../themes';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    paddingBottom: Metrics.baseMargin,
  },
  logo: {
    marginTop: Metrics.doubleSection,
    height: Metrics.images.logo,
    width: Metrics.images.logo,
    resizeMode: 'contain',
  },
  dayHeader: {
    padding: Metrics.doubleBaseMargin,
    // backgroundColor: Colors.separator,
    color: Colors.complement2,
    fontSize: Fonts.size.h4,
    // marginBottom: Metrics.baseMargin
  },
  todayHeader: {
    padding: Metrics.doubleBaseMargin,
    // backgroundColor: Colors.separator,
    color: Colors.primary,
    fontSize: Fonts.size.h4,
    // fontWeight: 'bold',
    // marginBottom: Metrics.baseMargin
  },
  dateHeader: {
    padding: Metrics.doubleBaseMargin,
    // backgroundColor: Colors.separator,
    color: Colors.complement1,
    fontSize: Fonts.size.small,
    // marginBottom: Metrics.baseMargin
  },
  centered: {
    alignItems: 'center',
  },

  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },

  emptyDate: {
    padding: Metrics.doubleBaseMargin,
    paddingTop: Metrics.doubleBaseMargin,
    // backgroundColor: Colors.separator,
    color: Colors.separator,
    textAlign: 'center',
    fontSize: Fonts.size.h3,
  },

  daysSeparator: {
    backgroundColor: Colors.separator,
    height: 1,
    marginTop: Metrics.baseMargin,
    marginHorizontal: Metrics.doubleBaseMargin,
  },
});

export const CalendarTheme = {
  // backgroundColor: Colors.bg,
  // calendarBackground: Colors.cyan,
  // // // textSectionTitleColor: '#b6c1cd',
  selectedDayBackgroundColor: Colors.cyan,
  // // selectedDayTextColor: '#ffffff',
  todayTextColor: Colors.magenta,
  // dayTextColor: 'white',
  // // textDisabledColor: '#d9e1e8',
  // dotColor: Colors.special,
  // selectedDotColor: '#ffffff',
  // arrowColor: 'orange',
  // monthTextColor: Colors.white,
  // textDayFontFamily: 'monospace',
  // textMonthFontFamily: 'monospace',
  // textDayHeaderFontFamily: 'monospace',
  // textMonthFontWeight: 'bold',
  // textDayFontSize: 16,
  // textMonthFontSize: 16,
  // textDayHeaderFontSize: 16
};

export const AgendaTheme = {
  agendaDayTextColor: Colors.cyan,
  agendaDayNumColor: Colors.cyan,
  agendaTodayColor: Colors.magenta,
  agendaKnobColor: Colors.magenta,
};
