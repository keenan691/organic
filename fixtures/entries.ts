
import Chance from 'chance'
import { OrgEntry } from 'redux/entries/types';
import Editor from 'components/editor';

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

export const generateRandomEntries = (num: number) =>
  Array(num)
  .fill(null)
  .map(() => createEntryListItem());

export const editorProps: React.ComponentProps<typeof Editor> = {
  workspaces: [
    createEntryListItem({
      level: 1,
      id: 'f1',
      headline: 'File one',
      type: 'file',
    }),
    createEntryListItem({
      level: 2,
      id: '1',
      fileId: 'f1',
      headline: 'asdf',
      type: 'workspace',
    }),
    createEntryListItem({
      level: 2,
      id: '2',
      fileId: 'f1',
      headline: 'asdf',
      type: 'workspace',
    }),
    createEntryListItem({
      level: 1,
      id: 'f2',
      headline: 'File two',
      type: 'file',
    }),
  ].reduce(
    (acc, item, idx) => ({...acc, [item.id]: {...item, position: idx + 1}}),
    {},
  ),
  entries: [
    createEntryListItem({level: 1}),
    createEntryListItem({level: 2}),
    createEntryListItem({level: 3, priority: 'A'}),
    createEntryListItem({level: 1, id: '2', priority: 'B', content: null}),
    createEntryListItem({
      level: 1,
      id: '1',
      priority: 'C',
      tags: ['easy', '@home'],
    }),
    ...generateRandomEntries(200),
  ].reduce(
    (acc, item, idx) => ({...acc, [item.id]: {...item, position: idx + 1}}),
    {},
  ),
};
