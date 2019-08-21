import { createStandardAction as action, createAsyncAction as asyncAction } from 'typesafe-actions'

const selectDevScreen = action('dev/SELECT_DEV_SCREEN')<any>()
// prettier-ignore
export default {
  selectDevScreen,
}
