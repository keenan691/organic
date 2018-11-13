import { createActions, createReducer } from "reduxsauce";
import Immutable from "seamless-immutable";

// * Types and Action Creators
// startupFinished
// agreePrivacyPolicy
const { Types, Creators } = createActions({
  agreePrivacyPolicy: null,
  startupFinished: null,
  startup: null
});

export const StartupTypes = Types;
export default Creators;

// * Initial State

export const INITIAL_STATE = Immutable({
  firstRun: true,
  privacyPolicyAgreed: false
});

// * Selectors

export const StartupSelectors = {
  isFirstRun: state => state.startup.firstRun,
  isPrivacyPolicyAgreed: state => state.startup.privacyPolicyAgreed
};

// * Reducers

export const agreePrivacyPolicy = (state) => { return state.merge({
  privacyPolicyAgreed: true
}) }

export const startupFinished = state => {
  return state.merge({
    firstRun: false
  });
};

// * Hookup Reducers To Types

export const reducer = createReducer(INITIAL_STATE, {
  [Types.AGREE_PRIVACY_POLICY]: agreePrivacyPolicy,
  [Types.STARTUP_FINISHED]: startupFinished
});
