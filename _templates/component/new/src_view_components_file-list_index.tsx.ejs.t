---
to: src/view/components/<%= h.changeCase.param(name) %>/index.tsx
---
import React from 'react'
import { FlatList } from 'react-native'

import { Separator, Empty } from 'elements'
import <%= h.changeCase.pascal(name) %>Item from './item'
import STRINGS from 'view/constants/strings'

type Props = {
   items: object[]
   onItemPress: (id: string) => null
   onItemLongPress: (id: string) => null
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
