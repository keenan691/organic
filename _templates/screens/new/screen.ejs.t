---
to: src/screens/<%= moduleName %>/<%= h.changeCase.pascal(name) %>.tsx
---
import React from 'react'
import { Options } from 'react-native-navigation';
import { View, Text, StyleSheet } from 'react-native'

type Props = {
  componentId: string;
};

export default function <%= h.changeCase.pascal(name) %>({componentId}: Props) {
  return (
    <View >
      <Text><%= name %></Text>
    </View>
  )
}

<%= h.changeCase.pascal(name) %>.options = (): Options => ({
  topBar: {
    title: {
      text: '<%= h.changeCase.pascal(name) %> Screen',
    },
  },
});

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
});
