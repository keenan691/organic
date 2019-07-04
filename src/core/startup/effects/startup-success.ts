import { call, put, select } from 'redux-saga/effects'

import { startupActions, startupSelectors } from 'core/startup'
import tabbedNavigation from 'navigators/navigation'

export default function*(action: ReturnType<typeof startupActions.startup.success>): Generator {
  yield call(tabbedNavigation)
}
