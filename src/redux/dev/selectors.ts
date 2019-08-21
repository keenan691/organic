import { InitialState } from './types'

const getCurrentDevScreen = (state: InitialState) => state.currentDevScreen
// prettier-ignore
const selectors = {
  getCurrentDevScreen,
}

export default selectors
