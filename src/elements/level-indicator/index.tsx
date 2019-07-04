import React, { memo } from 'react'
import { View, Text } from 'react-native'
import FontAwesome, { Icons } from 'react-native-fontawesome'
import styles from './styles'
import { INDENT_WIDTH } from 'components/entry-list/constants'

type Props = {
  level: number
} & typeof defaultProps

const defaultProps = {
  baseLevel: 1,
  flatDisplay: false,
}

function LevelIndicator(props: Props) {
  const levelMargin = props.flatDisplay ? 0 : INDENT_WIDTH * (props.level - props.baseLevel)
  return (
    <View style={{ paddingLeft: levelMargin }}>
      <Text style={styles[`h${props.level}C$`]}>
        <FontAwesome>{Icons.circle}</FontAwesome>{' '}
      </Text>
    </View>
  )
}

LevelIndicator.defaultProps = defaultProps

export default memo(LevelIndicator)
/* export default LevelIndicator */
