import { globalizeSelectors } from 'store/helpers'
import { REDUX_SLICE_NAME } from './constants'
import selectors from './selectors';
import reducers from './reducers';
import actions from './actions';
import effects from './effects'

const sourcesSelectors = globalizeSelectors(REDUX_SLICE_NAME)(selectors)

export { actions as sourcesActions, sourcesSelectors, effects, reducers, REDUX_SLICE_NAME }
