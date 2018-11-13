import { StyleSheet } from 'react-native'
import { Colors, Metrics, ApplicationStyles } from '../../themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  drawer: {
    backgroundColor: Colors.base02,
    flex:1
  },
  container: {
    flex: 1
  }
})
