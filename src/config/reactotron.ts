import Reactotron, { storybook } from 'reactotron-react-native'
import sagaPlugin from 'reactotron-redux-saga'
import { reactotronRedux } from 'reactotron-redux'
import { appConfig } from './app'
import { registerReactotronCustomCommands } from 'helpers/debug'

const useReactotron = __DEV__ && appConfig.useReactotron
// const useReactotron = false

let reactotron: any

if (useReactotron) {
  reactotron = Reactotron.configure({ name: 'organic' })
    .useReactNative({
      storybook: true,
      networking: { ignoreUrls: /symbolicate/ } })
    .use(reactotronRedux())
    .use(sagaPlugin())
    .connect()

  reactotron.clear()
  registerReactotronCustomCommands(reactotron)
  console.tron = reactotron
} else {
  console.tron = {
    log: () => null,
    debug: () => null,
    error: () => null,
    display: () => null
  }
}

export { reactotron }
