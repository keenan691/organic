import { OrgEntry } from 'core/entries/store/types'
import { ActionType } from 'typesafe-actions'
import initialState from './state';

export type State = typeof initialState

export type Refs = {
  entry: {
    commandMenuPosition: 'top' | 'bottom'
    heights: NumberDict
  }
  commands: {
    get: (kind: string) => Action
    commandMenuOffsets: { [id: MenuId]: number }
    setMenuOffset: (id: MenuId, newOffset:  number) => void
  },
  dispatch: (action: Action) => void
}

export type Context =  React.MutableRefObject<Refs>


export type Action = ActionType<typeof import('./actions').default>

export type Mode = 'outline' | 'filter' | 'read'
export type MenuType = 'global' | 'item'
export type MenuId = 'global' | 'entry'
export type Visibility = 'showContent'

export type BooleanDict = { [id: string]: boolean }
export type NumberDict = { [id: string]: number }
export type EntryDict = { [id: string]: OrgEntry }
