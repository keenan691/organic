import { globalizeSelectors } from 'store/helpers'
import actions from './actions'
import selectors from './selectors'
import reducers from './reducers'
import effects from './effects'

import { REDUX_SLICE_NAME } from './constants'

const startupSelectors = globalizeSelectors(REDUX_SLICE_NAME)(selectors)

export { actions as startupActions, startupSelectors, effects, reducers, REDUX_SLICE_NAME }
