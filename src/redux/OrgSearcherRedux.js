import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { filter } from 'ramda'
import { startsWith } from 'ramdasauce'
import R from 'ramda';


// * ------------- Types and Action Creators ------------

const { Types, Creators } = createActions({
  showSavedSearchesActions: ['item'],
  openSearchResult: ['fileID', 'nodeID'],
  searchSuccess: ['results'],
  search: ['query'],
  cancelSearch: null
})

export const OrgSearcherTypes = Types
export default Creators

// * ------------- Initial State ------------

export const INITIAL_STATE = Immutable({
  searching: false,
  searchResults: []
})

// * ------------- Selectors ------------

export const OrgSearcherSelectors = {
  searching: state => state.search.searching,
  searchResults: R.path(['search', 'searchResults'])
};

// * Reducers

export const searchSuccess = (state, { results }) => state.merge({
  searching: false,
})

export const performSearch = (state) => state.merge({
  searchResults: true
})

const openSearchResult = (state) => {
  return state
}

export const cancelSearch = (state) => INITIAL_STATE

// * ------------- Hookup Reducers To Types ------------

export const reducer = createReducer(INITIAL_STATE, {
  [Types.OPEN_SEARCH_RESULT]: openSearchResult,
  [Types.SEARCH_SUCCESS]: searchSuccess,
  [Types.SEARCH]: performSearch,
  [Types.CANCEL_SEARCH]: cancelSearch
})
