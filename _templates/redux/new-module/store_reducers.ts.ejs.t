---
to: src/redux/<%= name.toLowerCase() %>/reducers.ts
---
import { createReducer } from 'typesafe-actions'
import { InitialState } from './types'
import actions from './actions'

// prettier-ignore
const initialState: InitialState = {
}

// prettier-ignore
const reducers = createReducer(initialState)

export default reducers
