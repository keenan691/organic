import React from 'react'
import { storiesOf } from '@storybook/react-native'

import EntryList from 'components/entry-list'
import { createEntryListItem } from 'helpers/test-object-generator'

const generateRandomEntries = (num: number) => Array(num).fill(null).map(() => createEntryListItem())

const props: React.ComponentProps<typeof EntryList> = {
  items: [
    createEntryListItem({ level: 1, hasChildren: true }),
    createEntryListItem({ level: 2 , hasChildren: true}),
    createEntryListItem({ level: 3, priority: 'A', hasChildren: false }),
    createEntryListItem({ level: 1, priority: 'B', content: null , hasChildren: false}),
    createEntryListItem({ level: 1, priority: 'C', tags: ['easy', '@home'], hasChildren: false }),
    ... generateRandomEntries(200)
  ].reduce((acc, item, idx) => ({...acc, [item.id]: {...item, position: idx+1}}),{}),
  onItemPress: () => null,
  onItemLongPress: () => null,
}

storiesOf('Entry List', module).add('basic', () => <EntryList {...props} />)
