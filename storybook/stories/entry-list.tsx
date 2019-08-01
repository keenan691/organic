import React from 'react'
import { storiesOf } from '@storybook/react-native'

import EntryList from 'components/editor'
import { createEntryListItem } from 'helpers/test-object-generator'

const generateRandomEntries = (num: number) => Array(num).fill(null).map(() => createEntryListItem())

const props: React.ComponentProps<typeof EntryList> = {
  workspaces: [
    createEntryListItem({ level: 1, id: 'f1',headline: 'File one', type: 'file'}),
    createEntryListItem({ level: 2,id: '1', fileId: 'f1',headline: 'asdf', type: 'workspace'}),
    createEntryListItem({ level: 2,id: '2', fileId: 'f1',headline: 'asdf', type: 'workspace'}),
    createEntryListItem({ level: 1, id: 'f2',headline: 'File two', type: 'file'}),
  ].reduce((acc, item, idx) => ({...acc, [item.id]: {...item, position: idx+1}}),{}),
  entries: [
    createEntryListItem({ level: 1}),
    createEntryListItem({ level: 2 }),
    createEntryListItem({ level: 3, priority: 'A'}),
    createEntryListItem({ level: 1, id: '2',priority: 'B', content: null }),
    createEntryListItem({ level: 1, id: '1',priority: 'C', tags: ['easy', '@home']}),
    ... generateRandomEntries(200)
  ].reduce((acc, item, idx) => ({...acc, [item.id]: {...item, position: idx+1}}),{}),
}

storiesOf('Entry List', module).add('basic', () => <EntryList {...props} />)
