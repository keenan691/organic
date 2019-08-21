import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics } from 'themes'
import globalStyles from 'themes/globalStyles';
import { headlineStyles } from 'themes/levels';

export default StyleSheet.create({
  ...globalStyles,
  ...headlineStyles,
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  column: {
    flexDirection: 'column',
    flex: 1
  },
  contentPreviewText: {
    ...Fonts.style.label,
    fontSize: Fonts.size.small,
    color: Colors.base01,
  },
})
