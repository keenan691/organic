import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics } from 'view/themes'
import globalStyles from 'view/styles/global';

// prettier-ignore
export default StyleSheet.create({
  ...globalStyles,
  targetIndicator: {
      height: 1,
      width: '100%',
    backgroundColor: Colors.blue,
      position: 'absolute',
      zIndex: 1,
  },
  temporaryItem: {
    width: '100%',
    position: 'absolute',
    backgroundColor: Colors.white,
    opacity: 0.8,
    zIndex: 2,
  },
})
