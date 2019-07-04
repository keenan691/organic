---
to: src/core/<%= name.toLowerCase() %>/index.ts
---
import { globalizeSelectors } from 'store/helpers'
import { actions, reducers, selectors } from './store'
import { REDUX_SLICE_NAME } from './store/constants'
import effects from './effects'

const <%= name.toLowerCase() %>Selectors = globalizeSelectors(REDUX_SLICE_NAME)(selectors)

export { actions as <%= name.toLowerCase() %>Actions, <%= name.toLowerCase() %>Selectors, effects, reducers, REDUX_SLICE_NAME }
