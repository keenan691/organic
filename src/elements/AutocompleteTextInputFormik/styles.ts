import { StyleSheet } from 'react-native'
import { Colors, colors, Metrics } from 'themes';

export default StyleSheet.create({
  dropdown: {
    position: 'absolute',
    padding: Metrics.baseMargin,
    marginTop: 60,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 30,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5
  },
  dropdownItem: {
    color: Colors.white,
  },
})
