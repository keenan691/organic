---
to: src/redux/<%= name.toLowerCase() %>/index.ts
---
import { globalizeSelectors } from 'store/helpers'
import { REDUX_SLICE_NAME } from './constants'
import selectors from './selectors';
import reducers from './reducers';
import actions from './actions';
import effects from './effects'

const <%= name.toLowerCase() %>Selectors = globalizeSelectors(REDUX_SLICE_NAME)(selectors)

export { actions as <%= name.toLowerCase() %>Actions, <%= name.toLowerCase() %>Selectors, effects, reducers, REDUX_SLICE_NAME }
