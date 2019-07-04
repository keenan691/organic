import { Action } from 'typesafe-actions'

interface Reducer <S,  A>{ (state: S, action:  A): S }

export function reduceReducers<S extends object, A extends Action>(initialState: S, reducers: Reducer<S,A>[]): Reducer<S,A> {
  return (state = initialState, action) => reducers.reduce((prevState, reducer) => reducer(prevState, action), state)
}

// * example

function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

const obj = {
  test1: 4,
  test2: 5,
  oneOfSelf: 'test1'
}

getProperty( obj, 'test2')
