import { Navigation } from 'react-native-navigation'
import React, { Component } from 'react'
import Splash from 'modules/startup/screens/splash'
import { Screens } from './types'
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'

const registerComponentWithRedux = (redux: any) => (name: Screens, component: any) => {
  Navigation.registerComponentWithRedux(name, () => component, redux.Provider, redux.store)
}

export function registerScreens(redux: any) {
  registerComponentWithRedux(redux)('Splash', Splash)
}
