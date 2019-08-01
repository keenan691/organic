import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics } from 'view/themes'
import { headlineStyles } from 'view/styles/levels';
import globalStyles from 'view/styles/global';

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
