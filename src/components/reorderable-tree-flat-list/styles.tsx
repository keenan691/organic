import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics } from 'view/themes'

// prettier-ignore
export default StyleSheet.create({
  targetIndicator: {
      height: 2,
      width: 300,
      backgroundColor: 'green',
      position: 'absolute',
      zIndex: 300,
  },
  box: {
    width: '100%',
    position: 'absolute',
    height: 50,
    /* alignSelf: 'center', */
    backgroundColor: 'plum',
    opacity: 0.5,
    /* margin: 10, */
    zIndex: 200,
  },
})
