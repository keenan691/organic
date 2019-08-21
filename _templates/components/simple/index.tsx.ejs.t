---
to: src/components/<%= h.changeCase.pascal(name) %>/index.tsx
---
import React from 'react'
import { View, Text } from 'react-native'

type Props = {
   items: object[]
} & typeof defaultProps

const defaultProps = {}

function <%= h.changeCase.pascal(name) %>(props: Props) {
  return (
    <View>
      <Text><%= h.changeCase.title(name) %> </Text>
    </View>
  )
}

<%= h.changeCase.pascal(name) %>.defaultProps = defaultProps

export default <%= h.changeCase.pascal(name) %>
