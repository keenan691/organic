import { StateType, ActionType } from 'typesafe-actions'

export type RootAction = ActionType<typeof import('./actions').default>
export type UIRootAction = ActionType<typeof import('components/entry-list/actions').default>

declare module 'typesafe-actions' {
  interface Types {
    RootAction: RootAction | UIRootAction
  }
}
