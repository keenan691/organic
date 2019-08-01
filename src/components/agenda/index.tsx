import React from 'react'
import { View, Text } from 'react-native'

import styles from './styles'

type Props = {
} & typeof defaultProps

const defaultProps = {}

function Agenda(props: Props) {
  return (
    <View >
      <Text>agenda</Text>
    </View>
  )
}

Agenda.defaultProps = defaultProps

export default Agenda
