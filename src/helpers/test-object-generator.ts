import Chance from 'chance'

import { OrgFile } from 'core/files/store/types'
import { OrgEntry } from 'core/entries/store/types'

const chance = new Chance('seed')

export const createEntryListItem = (props?: OrgEntry): OrgEntry => ({
  id: chance.guid(),
  fileId: chance.guid(),
  level: parseInt(Math.random()*2)+1,
  headline: chance.sentence({ words: 2 }),
  content: chance.paragraph(),
  // content: '',
  tags: [],
  ...props
})

export const createFileListItem = (props?: OrgFile): OrgFile => ({
  id: chance.guid(),
  metadata: {
    TITLE: chance.sentence({ words: 2 }),
  },
  isChanged: true,
  path: 'path/file.org',
  ...props,
})
