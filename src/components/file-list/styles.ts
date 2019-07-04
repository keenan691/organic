import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics} from 'view/themes'

const PRIMARY_COLOR = Colors.green

export default StyleSheet.create({
  item: {
    paddingHorizontal: Metrics.doubleBaseMargin,
    paddingTop: Metrics.baseMargin + Metrics.smallMargin,
    paddingBottom: Metrics.baseMargin + Metrics.smallMargin,
    backgroundColor: Colors.bg,
  },
  itemTitle: {
    color: Colors.fileText,
    ...Fonts.style.h4,
  },
  label: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  labelText: {
    color: PRIMARY_COLOR,
  },
  labelIcon: {
    ...Fonts.style.h5,
    color: Colors.green,
  },
  fileStatus: {
    marginTop: Metrics.smallMargin,
  },
  infoMessage: {
    color: Colors.error,
  },
  errorMessage: {
    color: Colors.error,
  },
  warningMessage: {
    color: Colors.warning,
  },
})
