import Chance from 'chance'
import { OrgFile } from 'redux/files/types';

const chance = new Chance('seed')

export const createFileListItem = (props?: OrgFile): OrgFile => ({
  id: chance.guid(),
  metadata: {
    TITLE: chance.sentence({ words: 2 }),
  },
  isChanged: true,
  path: 'path/file.org',
  ...props,
})
