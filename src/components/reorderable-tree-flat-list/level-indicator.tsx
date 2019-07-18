import React, { memo, useEffect, useRef } from 'react'
import { View, Text, Animated, Easing } from 'react-native'
import styles from './styles'
import { INDENT_WIDTH } from 'components/entry-list/constants'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Icon } from 'elements'
import { usePrevious } from 'helpers/hooks'
import { cond } from 'ramda'
import { hasChildren } from './visibility'
import { isValid } from 'redux-form';

type Props = {
  level: number
  position: number
  onPress: (itemPosition: number) => void
} & typeof defaultProps

const defaultProps = {
  baseLevel: 1,
  flatDisplay: false,
  hasHiddenChildren: false,
  hasChildren: false,
  iconName: '',
}

function LevelIndicator(props: Props) {
  const { flatDisplay, level, hasHiddenChildren, baseLevel } = props
  const levelMargin = flatDisplay ? 0 : INDENT_WIDTH * (level - baseLevel)
  const iconName = props.iconName || getIconName(props)

  const iconSpinValue = useRef(new Animated.Value(0))
  const iconSpinInterpolated = useRef(iconSpinValue.current.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '90deg'],
      })
)

  useEffect(() => {
    console.tron.debug('hide')
    Animated.timing(iconSpinValue.current, {
      toValue: hasHiddenChildren ? 1 : 0,
      duration: 200,
      easing: Easing.linear,
    }).start()
  }, [hasHiddenChildren])

  return (
    <TouchableOpacity
      underlayColor="white"
      disabled={!props.position}
      onPress={() => props.onPress(props.position)}
    >
      <Animated.View
        style={[
          { paddingLeft: levelMargin},
        ]}
      >
        <Animated.View style={[ { transform: [{ rotate: iconSpinInterpolated.current }] },styles.headlineIndicator, styles[`h${props.level}BG`]]}>
          <Icon
            name={iconName}
            style={[styles.headlineIndicatorIcon, styles[`h${props.level}CH`]]}
          />
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  )
}

LevelIndicator.defaultProps = defaultProps

const getIconName = (props: Props) => {
  if (props.hasChildren) return 'angleRight'
  return
}

export default memo(LevelIndicator)
