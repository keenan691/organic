import { ActionType } from 'typesafe-actions'
import Creators from './actions'

export type InitialState = {
  isReady: boolean
  isFirstRun: boolean
  isPrivacyPolicyAgreed: boolean
}
