import { compose, range, map, append, flatten } from 'ramda'

import { shadeBlend } from 'helpers/colors'
import { Colors } from '.'
import { light } from './helpers'

const orgHeadersColors = [
  light(Colors.complementRed),
  shadeBlend(0.2, Colors.afterblue),
  Colors.complement1,
  shadeBlend(0.1, Colors.violet),
  Colors.cyan,
  Colors.yellow,
]

const repeat = (maxLevel: number, colors: any[]) =>
  compose(
    flatten,
    append(colors.slice(0, maxLevel % colors.length)),
    map(() => colors)
  )(range(0, Math.floor(maxLevel / colors.length)))

export const levelColors = repeat(15, orgHeadersColors)

export const getItemColor = ({type, level}) => {
  switch (type) {
    case 'file':
      return Colors.special
case 'workspace':
      return Colors.special
    default:
      return levelColors[level-1]
  }
}
