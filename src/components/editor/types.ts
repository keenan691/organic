import { OrgEntry } from 'modules/entries/store/types'
import { ActionType } from 'typesafe-actions'

export type Action = ActionType<typeof import('./actions').default>

export type Perspective = 'outline' | 'content' | 'read'
export type MenuType = 'global' | 'item'
export type MenuId = 'global' | 'entry'
export type Visibility = 'showContent'

export type Item = {
  headline: string
  position: number
  id:  string
  type: 'file' | 'entry' | 'project' | 'workspace'
}

export type BooleanDict = { [id: string]: boolean }
export type NumberDict = { [id: string]: number }
export type EntryDict = { [id: string]: OrgEntry }
