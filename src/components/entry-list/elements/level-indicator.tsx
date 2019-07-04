import React, { memo } from 'react'
import { View, Text } from 'react-native'
import FontAwesome, { Icons } from 'react-native-fontawesome'
import styles from 'elements/entry-headline/styles'
import { INDENT_WIDTH } from '../constants'
import { TouchableOpacity } from 'react-native-gesture-handler'

type Props = {
  level: number
  position: number
  onPress: () => void
} & typeof defaultProps

const defaultProps = {
  baseLevel: 1,
  flatDisplay: false,
}

function LevelIndicator(props: Props) {
  const levelMargin = props.flatDisplay ? 0 : INDENT_WIDTH * (props.level - props.baseLevel)
  const style = styles[`h${props.level}C`]
  return (
    <View style={{ paddingLeft: levelMargin }}>
      <TouchableOpacity onPress={_ => props.onPress(props.position)}>
        <Text style={style}>
          <FontAwesome>{Icons.circle}</FontAwesome>
        </Text>
      </TouchableOpacity>
    </View>
  )
}

LevelIndicator.defaultProps = defaultProps

export default memo(LevelIndicator)
