---
to: src/components/<%= h.changeCase.param(name) %>/index.tsx
---
import React from 'react'
import { View, Text } from 'react-native'

import styles from './styles'

type Props = {
} & typeof defaultProps

const defaultProps = {}

function <%= h.changeCase.pascal(name) %>(props: Props) {
  return (
    <View >
      <Text><%= name %></Text>
    </View>
  )
}

<%= h.changeCase.pascal(name) %>.defaultProps = defaultProps

export default <%= h.changeCase.pascal(name) %>
