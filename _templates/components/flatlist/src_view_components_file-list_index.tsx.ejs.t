---
to: src/components/<%= h.changeCase.pascal(name) %>/index.tsx
---
import React from 'react'
import { FlatList } from 'react-native'

import { Separator, Empty } from 'elements'
import Item from './item'

type Props = {
   items: object[]
} & typeof defaultProps

const defaultProps = {}

function <%= h.changeCase.pascal(name) %>(props: Props) {
  return (
    <FlatList
      keyExtractor={item => item.id}
      data={props.items}
      renderItem={({ item }) => (
        <FileListItem
          item={item}
          onPress={props.onItemPress(item.id)}
          onLongPress={props.onItemLongPress(item.id)}
        />
      )}
      ItemSeparatorComponent={Separator}
      ListEmptyComponent={() => (
        <Empty itemName={STRINGS.file.namePlural} message={STRINGS.file.emptyDescription} />
      )}
    />
  )
}

<%= h.changeCase.pascal(name) %>.defaultProps = defaultProps

export default <%= h.changeCase.pascal(name) %>
