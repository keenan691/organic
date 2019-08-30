---
to: src/elements/<%= h.changeCase.pascal(name) %>/index.tsx
---
import React from 'react'
import { View, Text } from 'react-native'
import styles from './styles'

type Props = {
}

function <%= h.changeCase.pascal(name) %> (props: Props) {
  return (
    <View>
      <Text>Element <%= h.changeCase.title(name) %></Text>
    </View>
  )
}

export default <%= h.changeCase.pascal(name) %> %>
