import { all, takeEvery, takeLatest } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'

import { actions } from '../store'
import startupRequest from './startup-request'
import startupSuccess from './startup-success'

// prettier-ignore
export default [
  takeLatest(getType(actions.startup.success), startupSuccess),
  takeLatest(getType(actions.startup.request), startupRequest),
]
