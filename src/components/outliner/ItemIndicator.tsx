import React, { memo, useEffect, useRef } from 'react'
import { View, Animated, Easing } from 'react-native'
import styles from './styles'
import { INDENT_WIDTH } from 'components/editor/constants'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Icon } from 'elements'
import { usePrevious } from 'helpers/hooks'
import { getItemColor } from 'view/themes/org-colors';

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
  hasContent: false,
}

function ItemIndicator(props: Props) {
  const { flatDisplay, level, hasHiddenChildren, baseLevel, position, type } = props
  const width = flatDisplay ? INDENT_WIDTH : INDENT_WIDTH * level
  const iconName = props.iconName || getIconName(props) || null

  const color = getItemColor({ level, type})
  const iconSpinValue = useRef(new Animated.Value(0))
  const iconSpinInterpolated = useRef(
    iconSpinValue.current.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '90deg'],
    })
  )

  const prevPosition = usePrevious(position)

  const newIconSpinValue = hasHiddenChildren ? 1 : 0

  // Do not animate when identity of visualized item changes
  // This is special use case for ItemDraggable
  if (position !== prevPosition) {
    iconSpinValue.current.setValue(newIconSpinValue)
  }

  useEffect(() => {
    if (position === prevPosition) {
      Animated.timing(iconSpinValue.current, {
        toValue: newIconSpinValue,
        duration: 200,
        easing: Easing.linear,
      }).start()
    }
  }, [hasHiddenChildren])

  return (
    <TouchableOpacity onPress={() => props.onPress(props.position)}>
      <View style={[styles.headlineIndicatorWrapper, { width }]}>
        <Animated.View
          style={[
            {
              backgroundColor: color,
              transform: [{ rotate: iconSpinInterpolated.current }] },
            styles.headlineIndicator,
          ]}
        >
          {iconName && (
            <Icon
              name={iconName}
              style={[styles.headlineIndicatorIcon, styles[`h${props.level}CH`]]}
            />
          )}
        </Animated.View>
      </View>
    </TouchableOpacity>
  )
}

ItemIndicator.defaultProps = defaultProps

const getIconName = ({hasChildren, type}: Props) => {
  /* if (type==='workspace') return  'genderless' */
  if (hasChildren) return 'angleRight'
  return
}

export default memo(ItemIndicator)
