import { ActionType } from 'typesafe-actions'
import Creators from './actions'

// prettier-ignore
export type InitialState = {
}

export type Source = {
  type: 'webdav' | 'resillio-sync' | 'local-file'
  url: string
  path: string
  username: string
  password: string
}
