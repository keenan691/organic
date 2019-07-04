import { globalizeSelectors } from 'store/helpers'
import { actions, reducers, selectors } from './store'
import effects from './effects'
import { REDUX_SLICE_NAME } from './store/constants'

const startupSelectors = globalizeSelectors(REDUX_SLICE_NAME)(selectors)

export { actions as startupActions, startupSelectors, effects, reducers, REDUX_SLICE_NAME }
