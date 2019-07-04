import { all, takeEvery, takeLatest } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'
import { actions } from '../store'
import loadFileContent from './loadFileContent'

// prettier-ignore
export default [
  takeLatest(getType(actions.createFileFromSource.request), loadFileContent),
]
