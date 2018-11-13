// * Imports

import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

// * Types And Action Creators

const { Types, Creators } = createActions({
  `(skeleton/buffer-name-camelcase)`Request: ['data'],
  `(skeleton/buffer-name-camelcase)`Success: ['payload'],
  `(skeleton/buffer-name-camelcase)`Failure: null
})

export const `(skeleton/buffer-name)`Types = Types
export default Creators

// * Initial State

export const INITIAL_STATE = Immutable({
  data: null,
  fetching: null,
  payload: null,
  error: null
})

// * Selectors

export const `(skeleton/buffer-name)`Selectors = {
  getData: state => state.data
}

// * Reducers

// request the data from an api
export const request = (state, { data }) =>
  state.merge({ fetching: true, data, payload: null })

// successful api lookup
export const success = (state, action) => {
  const { payload } = action
  return state.merge({ fetching: false, error: null, payload })
}

// Something went wrong somewhere.
export const failure = state =>
  state.merge({ fetching: false, error: true, payload: null })

// * Hookup Reducers To Types-

export const reducer = createReducer(INITIAL_STATE, {
  [Types.`(string-inflection-upcase-function (skeleton/buffer-name))`_REQUEST]: request,
  [Types.`(string-inflection-upcase-function (skeleton/buffer-name))`_SUCCESS]: success,
  [Types.`(string-inflection-upcase-function (skeleton/buffer-name))`_FAILURE]: failure
})
