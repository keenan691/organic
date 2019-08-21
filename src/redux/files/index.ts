import { globalizeSelectors } from 'store/helpers'
import effects from './effects'
import { REDUX_SLICE_NAME } from './constants';
import selectors from './selectors';
import actions from './actions';
import reducers from './reducers';

const filesSelectors = globalizeSelectors(REDUX_SLICE_NAME)(selectors)

export { actions as filesActions, filesSelectors, effects, reducers, REDUX_SLICE_NAME }
