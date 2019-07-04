import { InitialState } from './types'

const getIsPrivacyPolicyAgreed = (state: InitialState) => state.isPrivacyPolicyAgreed
const getIsFirstRun = (state: InitialState) => state.isFirstRun
const getIsReady = (state: InitialState) => state.isReady

const selectors = {
  getIsFirstRun,
  getIsPrivacyPolicyAgreed,
  getIsReady,
}

export default selectors
