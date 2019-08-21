import { all } from 'redux-saga/effects'
import { effects as startupEffects } from 'redux/startup'
import { effects as filesEffects } from 'redux/files'
import { effects as entriesEffects } from 'redux/entries'

export default function* root() {
  yield all([...entriesEffects])
  yield all([...filesEffects])
  yield all([...startupEffects])
}
