import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import styles from '../styles'

type Props = {
  title: string
  onPress: () => void
} & typeof defaultProps

const defaultProps = {
  disabled: false,
}

function CommandMenuButton({ disabled, onPress, title }: Props) {
  return (
    <TouchableOpacity disabled={disabled} onPress={onPress}>
      <Text
        style={[styles.commandMenuItem, disabled && styles.commandMenuItemDisabled]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  )
}

CommandMenuButton.defaultProps = defaultProps

export default CommandMenuButton
