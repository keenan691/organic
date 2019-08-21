import { all } from 'redux-saga/effects'
import { effects as startupEffects } from 'redux/startup'
import { effects as filesEffects } from 'redux/files'
import { effects as entriesEffects } from 'redux/entries'
import { effects as devEffects } from 'redux/dev'

export default function* root() {
  yield all([...devEffects])
  yield all([...entriesEffects])
  yield all([...filesEffects])
  yield all([...startupEffects])
}
