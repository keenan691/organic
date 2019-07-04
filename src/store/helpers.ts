import R from 'ramda'

export const globalizeSelectors = (sliceName: string) => <T>(sel: T): T =>
  R.map(fun => globalState => fun(globalState[sliceName]))(sel)

export const globalizeParametrizedSelectors = (sliceName: string) => <T>(sel: T): T =>
  R.map(fun => (...parameters) => globalState => fun(...parameters)(globalState[sliceName]))(sel)
