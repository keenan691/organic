import { Navigation } from 'react-native-navigation'
import Splash from './splash'
import Workspace from './workspace'
import { Screens } from './types'
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'

const registerComponentWithRedux = (redux: any) => (name: string, component: any) => {
  Navigation.registerComponentWithRedux(
    name,
    () => gestureHandlerRootHOC(component),
    redux.Provider,
    redux.store
  )
}

export function registerScreens(redux: any) {
  registerComponentWithRedux(redux)(<Screens>'Splash', Splash)
  registerComponentWithRedux(redux)(<Screens>'Workspace', Workspace)
}
