import { call, put, select } from 'redux-saga/effects'
import { entriesActions, entriesSelectors } from 'core/entries'

export default function*(action: ReturnType<typeof entriesActions.loadEntries.request>): Generator {
  console.tron.error('Effect loadEntries not implemented')
}
