---
to: src/core/<%= name.toLowerCase() %>/store/index.ts
---
import actions from './actions'
import reducers from './reducers'
import selectors from './selectors'

export { reducers, actions, selectors }
