import React, { memo } from 'react'
import { View, Text } from 'react-native'
import FontAwesome, { Icons } from 'react-native-fontawesome'
import styles from './styles'
import { INDENT_WIDTH } from 'components/entry-list/constants'
import { TouchableHighlight } from 'react-native-gesture-handler'

type Props = {
  level: number
  position: number
  onPress: (itemPosition: number) => void
} & typeof defaultProps

const defaultProps = {
  baseLevel: 1,
  flatDisplay: false,
  iconName: 'circle'
}

function LevelIndicator(props: Props) {
  const levelMargin = props.flatDisplay ? 0 : INDENT_WIDTH * (props.level - props.baseLevel)
  return (
    <TouchableHighlight disabled={!props.position} onPress={() => props.onPress(props.position)}>
      <View style={{ paddingLeft: levelMargin }}>
        <Text style={styles[`h${props.level}C$`]}>
          <FontAwesome>{Icons[props.iconName]}</FontAwesome>{' '}
        </Text>
      </View>
    </TouchableHighlight>
  )
}

LevelIndicator.defaultProps = defaultProps

export default memo(LevelIndicator)
