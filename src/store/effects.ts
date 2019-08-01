import { all } from 'redux-saga/effects'
import { effects as startupEffects } from 'modules/startup'
import { effects as filesEffects } from 'modules/files'
import { effects as entriesEffects } from 'modules/entries'

export default function* root() {
  yield all([...entriesEffects])
  yield all([...filesEffects])
  yield all([...startupEffects])
}
