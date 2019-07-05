import orderingReducer from './ordering'
import { reduceReducers } from 'helpers/reducers'

import initialState from '../state';

import commandsReducer from './commands'
import interactionsReducer from './interactions'
import togglesReducer from './toggles'

// prettier-ignore
const entryListReducer = reduceReducers(initialState, [
  orderingReducer,
  commandsReducer,
  interactionsReducer,
  togglesReducer
])

export default entryListReducer
