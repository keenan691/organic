import { all, takeEvery, takeLatest } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'
import { actions } from '../store'
import preloadEntries from './preloadEntries'
import loadEntries from './loadEntries'

// prettier-ignore
export default [
  takeLatest(getType(actions.loadEntries.request), loadEntries),
  takeLatest(getType(actions.preloadEntries.request), preloadEntries),
]
