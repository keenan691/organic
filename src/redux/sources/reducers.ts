import { createReducer } from 'typesafe-actions'
import { InitialState } from './types'
import actions from './actions'
import { evolve, identity, append } from 'ramda';

// prettier-ignore
const initialState: InitialState = {
  status: 'ready',
  data: []
}

const reducers = createReducer(initialState)
  .handleAction(actions.addSource.request, state => ({...state, status: 'importing'}))
  .handleAction(actions.addSource.cancel, state => state)
  .handleAction(actions.addSource.failure, state => state)
  .handleAction(actions.addSource.success, (state, {payload}) => evolve({
    status: identity('ready'),
    data: append(payload)
  })(state))

export default reducers
