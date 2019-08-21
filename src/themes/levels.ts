
import { levelColors } from 'themes/org-colors'
import { Fonts, Colors } from 'themes';

export const headlineStyles = levelColors.reduce(
  (acc, color, idx) => ({
    ...acc,
    [`h${idx + 1}BG`]: {
      backgroundColor: color,
    },
    [`h${idx + 1}C`]: {
      color,
    },
    [`h${idx + 1}CH`]: {
      // color: shadeBlend(0.13,color, Colors.white),
      color: Colors.lightGray,
      // fontSize: Fonts.size.regular,
    },
    [`h${idx + 1}R`]: {
      fontSize: Fonts.size.h2 - idx * 6,
      fontWeight: idx === 0 ? 'bold' : 'normal'
    },
  }),
  {}
)
