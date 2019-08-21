import { StyleSheet } from 'react-native'
import { Colors} from 'themes/colors'
import globalStyles from 'themes/globalStyles'

export default StyleSheet.create({
  ...globalStyles,
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  entryFocusedBg: {
    backgroundColor: Colors.separator,
  },
  commandMenuItem: {
    paddingHorizontal: 5,
    color: Colors.white,
  },
  commandMenuItemDisabled: {
    color: Colors.separator,
  },
  scene: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  modeline: {
    backgroundColor: Colors.bg,
  },
  modelineLabel: {
    color: Colors.red,
  }
})
