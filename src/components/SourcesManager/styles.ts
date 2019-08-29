import {StyleSheet} from 'react-native';
import {Fonts, Colors, Metrics} from 'themes';
import globalStyles from 'themes/globalStyles';
import {headlineStyles} from 'themes/levels';

export default StyleSheet.create({
  ...globalStyles,
  ...headlineStyles,
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  column: {
    flexDirection: 'column',
    flex: 1,
  },
  fab: {},
  contentPreviewText: {
    ...Fonts.style.label,
    fontSize: Fonts.size.small,
    color: Colors.base01,
  },
  fabWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    left: 0,
    right: 0,
    bottom: 30,
  },

  panel: {
    height: 600,
    padding: 20,
    backgroundColor: '#2c2c2fAA',
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 5,
    shadowOpacity: 0.4,
  },
});
