import { call, put, select } from 'redux-saga/effects'

import { startupActions, startupSelectors } from 'modules/startup/index'
import tabbedNavigation from 'navigators/navigation'

export default function*(action: ReturnType<typeof startupActions.startup.success>): Generator {
  // yield call(tabbedNavigation)
}
