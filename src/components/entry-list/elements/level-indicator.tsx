import React, { memo } from 'react'
import { View, Text } from 'react-native'
import FontAwesome, { Icons } from 'react-native-fontawesome'
import styles from 'elements/entry-headline/styles'
import { INDENT_WIDTH } from '../constants'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Icon } from 'elements';

type Props = {
  level: number
  position: number
  iconName: React.ComponentProps<typeof Icon>['name']
  onPress: () => void
} & typeof defaultProps

const defaultProps = {
  baseLevel: 1,
  flatDisplay: false,
  highlighted: false,
  iconName: 'circle',
  position: null
}

function LevelIndicator(props: Props) {
  const headlineType = 'C' + (props.highlighted ? 'H' : '')
  const levelMargin = props.flatDisplay ? 0 : INDENT_WIDTH * (props.level - props.baseLevel)
  const style = styles[`h${props.level + headlineType}`]
  return (
    <View style={{ paddingLeft: levelMargin }}>
      <TouchableOpacity onPress={_ => props.onPress(props.position)}>
        <Icon name={props.iconName} style={style} />
      </TouchableOpacity>
    </View>
  )
}

LevelIndicator.defaultProps = defaultProps

export default memo(LevelIndicator)
