import { StyleSheet } from 'react-native'

import { Fonts, Colors, Metrics } from 'view/themes'
import { levelColors } from 'view/themes/org-colors'
import { shadeBlend } from 'helpers/colors';

const headlineStyles = levelColors.reduce(
  (acc, color, idx) => ({
    ...acc,
    [`h${idx + 1}C`]: {
      color,
      fontSize: Fonts.size.regular,
    },
    [`h${idx + 1}CH`]: {
      color: shadeBlend(-0.4,color, Colors.white),
      fontSize: Fonts.size.regular,
    },
    [`h${idx + 1}R`]: {
      fontSize: Fonts.size.h2 - idx * 6,
      fontWeight: idx === 0 ? 'bold' : 'normal'
    },
  }),
  {}
)

export default StyleSheet.create({
  h0: {
    color: Colors.fileText,
    fontSize: Fonts.size.regular,
  },
  ...headlineStyles,
  agendaDisplay: {
    color: Colors.complement1,
  },
  level: {
    color: Colors.bg,
  },
  todo: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  doneText: {
    color: Colors.green,
  },
  deadline: {
    color: Colors.special,
  },
  tags: {
    fontWeight: 'bold',
  },
  priority: {
    color: Colors.green,
    fontWeight: 'bold',
  },
  contentContainer: {
    // backgroundColor: Colors.base01,
    flex: 1,
  },
  contentText: {
    ...Fonts.style.normal,
    color: Colors.base0,
  },
  listStickedSectionText: {
    color: Colors.white,
    padding: Metrics.baseMargin,
    backgroundColor: Colors.secondary,
    ...Fonts.style.h4,
    paddingHorizontal: Metrics.doubleBaseMargin - Metrics.smallMargin - 1,
  },
  link: {
    textDecorationLine: 'underline',
  },
})
