---
to: src/core/<%= name.toLowerCase() %>/store/reducers.ts
---
import product from 'immer'
import { createReducer } from 'typesafe-actions'
import { InitialState } from './types'
import actions from './actions'

// prettier-ignore
const initialState: InitialState = {
}

// prettier-ignore
const reducer = createReducer(initialState)

export default reducer
