import React, { memo, useEffect, useRef } from 'react'
import { View, Animated, Easing } from 'react-native'
import styles from './styles'
import { INDENT_WIDTH } from 'components/entry-list/constants'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Icon } from 'elements'

type Props = {
  level: number
  position: number
  iconName?: keyof typeof Icon
  onPress: (itemPosition: number) => void
} & typeof defaultProps

const defaultProps = {
  baseLevel: 1,
  flatDisplay: false,
  hasHiddenChildren: false,
  hasChildren: false,
  hasContent: false
}

function ItemIndicator(props: Props) {
  const { flatDisplay, level, hasHiddenChildren, baseLevel } = props
  const width =  flatDisplay ? INDENT_WIDTH : INDENT_WIDTH * level
  const iconName = props.iconName || getIconName(props) || null

  const iconSpinValue = useRef(new Animated.Value(0))
  const iconSpinInterpolated = useRef(
    iconSpinValue.current.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '90deg'],
    })
  )

  useEffect(() => {
    Animated.timing(iconSpinValue.current, {
      toValue: hasHiddenChildren ? 1 : 0,
      duration: 200,
      easing: Easing.linear,
    }).start()
  }, [hasHiddenChildren])

  return (
    <TouchableOpacity
      onPress={() => props.onPress(props.position)}
    >
      <View style={[ styles.headlineIndicatorWrapper,{ width } ]}>
        <Animated.View
          style={[
            { transform: [{ rotate: iconSpinInterpolated.current }] },
            styles.headlineIndicator,
            styles.headlineIndicatorHasContent,
            styles[`h${props.level}BG`],
          ]}
        >
          {iconName && <Icon
            name={iconName}
            style={[styles.headlineIndicatorIcon, styles[`h${props.level}CH`]]}
          /> }
        </Animated.View>
      </View>
    </TouchableOpacity>
  )
}

ItemIndicator.defaultProps = defaultProps

const getIconName = (props: Props) => {
  if (props.hasChildren) return 'angleRight'
  return
}

export default memo(ItemIndicator)
