---
to: src/<%= moduleKind %>/<%= moduleName %>/reducers/<%= name %>.ts
---
import { createReducer } from 'typesafe-actions'
import produce from 'immer'

import initialState  from '../state';
import actions from '../actions'

const <%= h.changeCase.camel(name) %>Reducer = createReducer(initialState)
  .handleAction(actions.runCommand, (state, { payload }) => state)

export default <%= h.changeCase.snake(name) %>Reducer
