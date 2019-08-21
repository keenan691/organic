---
to: src/components/<%= h.changeCase.pascal(name) %>/styles.ts
---
import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics} from 'view/themes'

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
})
