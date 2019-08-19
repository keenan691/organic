import { Navigation } from 'react-native-navigation'
import React, { Component } from 'react'
import Splash from 'modules/startup/screens/splash'

const registerComponentWithRedux = (redux: any) => (name, component: any) => {
  Navigation.registerComponentWithRedux(name, () => component, redux.Provider, redux.store)
}

export function registerScreens(redux: any) {
  registerComponentWithRedux(redux)('Splash', Splash)
}
