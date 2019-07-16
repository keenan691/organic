import React, { memo } from 'react'
import { View, Text } from 'react-native'
import styles from './styles'
import { INDENT_WIDTH } from 'components/entry-list/constants'
import { TouchableHighlight } from 'react-native-gesture-handler'
import { Icon } from 'elements';

type Props = {
  level: number
  position: number
  onPress: (itemPosition: number) => void
} & typeof defaultProps

const defaultProps = {
  baseLevel: 1,
  flatDisplay: false,
  hasHiddenChildren: false
}

function LevelIndicator(props: Props) {
  const levelMargin = props.flatDisplay ? 0 : INDENT_WIDTH * (props.level - props.baseLevel)
  const iconName = props.iconName || getIconName(props)
  return (
    <TouchableHighlight disabled={!props.position} onPress={() => props.onPress(props.position)}>
      <View style={{ paddingLeft: levelMargin }}>
        <Icon
          style={styles[`h${props.level}C`]}
          name={iconName}/>
      </View>
    </TouchableHighlight>
  )
}

LevelIndicator.defaultProps = defaultProps

const getIconName = (props: Props) => {
  if (props.hasHiddenChildren) return 'circle'
  return 'circleNotch'
}

export default memo(LevelIndicator)
