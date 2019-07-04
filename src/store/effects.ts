import { all } from 'redux-saga/effects'
import { effects as startupEffects } from 'core/startup'
import { effects as filesEffects } from 'core/files'
import { effects as entriesEffects } from 'core/entries'

export default function* root() {
  yield all([...entriesEffects])
  yield all([...filesEffects])
  yield all([...startupEffects])
}
