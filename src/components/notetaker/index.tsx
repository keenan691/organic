import React from 'react'
import { View, Text } from 'react-native'

import styles from './styles'

type Props = {
} & typeof defaultProps

const defaultProps = {}

function Notetaker(props: Props) {
  return (
    <View >
      <Text>notetaker</Text>
    </View>
  )
}

Notetaker.defaultProps = defaultProps

export default Notetaker
