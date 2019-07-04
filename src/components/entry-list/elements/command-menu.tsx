import React, { useRef, useEffect, useState, useCallback, useContext, memo } from 'react'
import { View, ScrollView, LayoutAnimation } from 'react-native'

import styles from '../styles'
import { levelColors } from 'view/themes/org-colors'
import { MenuType } from '../types'
import { Colors } from 'view/themes'
import { EntryListContext } from '..'
import actions from '../actions'
import CommandMenuButton from './command-menu-button'
import { animationForCommandsMenu } from '../animations';
import { useStateMonitor } from 'helpers/hooks';

type Props = {
  show: boolean
  type: MenuType
} & typeof defaultProps

const defaultProps = {
  show: false,
  level: 0,
}

function CommandMenu(props: Props) {
  const [isExpanded, setIsExpanded] = useState(false)

  const { show, type } = props
  const { dispatch, commands } = useContext(EntryListContext).current

  const scrollViewRef = useRef<ScrollView>()

  const toggleExpandedCallback = useCallback(() => {
    setIsExpanded(prevState => !prevState)
    LayoutAnimation.configureNext(animationForCommandsMenu)
  }, [])

  const setMenuOffsetCallback = useCallback(event => {
    const offset = event.nativeEvent.contentOffset
    commands.setMenuOffset[type] = offset
  }, [])

  const repeatLastCommandCallback = useCallback(() => dispatch(actions.repeatLastAction()) ,[])

  useEffect(() => {
    scrollViewRef.current && scrollViewRef.current.scrollTo(commands.commandMenuOffsets[type])
  })

  const containerStyles = [styles.row]
  const levelColor = props.level && levelColors[props.level - 1]
  const containerColor = show ? levelColor || Colors.menuButton : Colors.transparent
  containerStyles.push({ backgroundColor: containerColor })

  return (
    <View style={containerStyles}>
      {show && (
        <View style={styles.row}>
          <CommandMenuButton title="more" onPress={toggleExpandedCallback} />

          <ScrollView
            onMomentumScrollEnd={setMenuOffsetCallback}
            horizontal={!isExpanded}
            showsHorizontalScrollIndicator={false}
            ref={scrollViewRef}
          >
            {commands.get(type).map(command => (
              <CommandMenuButton
                disabled={command.disabled}
                onPress={() => dispatch(actions.runCommand(command))}
                title={command.name}
              />
            ))}
          </ScrollView>

          <CommandMenuButton title="repeat" onPress={repeatLastCommandCallback} />
        </View>
      )}
    </View>
  )
}

CommandMenu.defaultProps = defaultProps

export default memo(CommandMenu)
