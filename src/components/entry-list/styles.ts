import { StyleSheet } from 'react-native'
import { Colors} from 'view/themes'
import globalStyles from 'view/styles/global'

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
  },
  modeline: {
    backgroundColor: Colors.violet,
  },
})
