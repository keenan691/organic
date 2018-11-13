import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics, ApplicationStyles } from '../../themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    marginHorizontal: Metrics.marginHorizontal
  },
  section: {
    padding: Metrics.baseMargin
  },
  closeButton: {
    ...Fonts.style.h4,
    color: Colors.base1,
    margin: Metrics.smallMargin,
    alignSelf: 'flex-end'
  }

})
