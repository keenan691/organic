import React from 'react'
import { View, Text } from 'react-native'

import styles from './styles'

type Props = {
} & typeof defaultProps

const defaultProps = {}

function Searcher(props: Props) {
  return (
    <View >
      <Text>searcher</Text>
    </View>
  )
}

Searcher.defaultProps = defaultProps

export default Searcher
