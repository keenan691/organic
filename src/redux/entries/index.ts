import { globalizeSelectors } from 'store/helpers'
import effects from './effects'
import { REDUX_SLICE_NAME } from './constants';
import selectors from './selectors';
import reducers from './reducers';
import actions from './actions';

const entriesSelectors = globalizeSelectors(REDUX_SLICE_NAME)(selectors)

export { actions as entriesActions, entriesSelectors, effects, reducers, REDUX_SLICE_NAME }
