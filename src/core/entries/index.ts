import { globalizeSelectors } from 'store/helpers'
import { actions, reducers, selectors } from './store'
import { REDUX_SLICE_NAME } from './store/constants'
import effects from './effects'

const entriesSelectors = globalizeSelectors(REDUX_SLICE_NAME)(selectors)

export { actions as entriesActions, entriesSelectors, effects, reducers, REDUX_SLICE_NAME }
