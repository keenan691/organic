import { ActionType } from 'typesafe-actions'
import Creators from './actions'

// prettier-ignore
export type InitialState = {
}

export type Stat = {
  filename: string
  basename: string
  lastmod: string // "Sun, 13 Mar 2016 04:23:32 GMT",
  size: number
  type: 'file' | 'directory'
  mime: string
  etag: string //"33a728c7f288ede1fecc90ac6a10e062"
}

export type Source = {
  type: 'webdav' | 'resillio-sync' | 'local-file'
  url: string
  path: string
  username: string
  password: string
}
