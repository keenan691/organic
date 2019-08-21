import {Reducer, useCallback, useEffect, useReducer, useRef} from 'react'
import {complement, compose, filter, isNil, nth} from 'ramda'
import {objectDiff} from 'helpers/object';
import {Action} from "../components/editor/types";
import {logAction} from "./debug";


export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export function useMeasure(name: string) {
  const bench = console.tron.benchmark(name)
  useEffect(() => {
    bench.stop('Component rendered')
  })
  return bench
}

const filterEmptyDiffs = filter(
  compose(
    complement(isNil),
    nth(1)
  )
)

export function useStateMonitor(state: {}) {
  let prevStateRef = useRef()
  const prevState = prevStateRef.current
  const withPrevStateDiff = objectDiff(prevState)

  if (prevState && prevState !== state) {
    // console.tron.clear()
    const diff = compose(
      filterEmptyDiffs,
      withPrevStateDiff
    )(state)

    const diffPreview = Object.entries(diff)[0]
    console.tron.display({
      name: 'STATE DIFF',
      preview: diffPreview,
      important: true,
      value: diff,
    })
  } else if (!prevState) {
    console.tron.clear()
    console.tron.display({
      name: 'STATE INIT',
      important: true,
      value: state,
    })
  }

  prevStateRef.current = state
}

export function useDebugReducer<R extends Reducer<S, F>, S, F>(red: R, initS: S, init: F): [S, (action: Action) => void] {
  // TODO save last dispatched action of type interactive
  // TODO create custom action type with diaplay name
  // TODO toggle monitoring
  const [state, dispatch] = useReducer(red, initS, init);

  const wrappedDispatch = useCallback(action => {
    const updatedAction = {
      ...action,
      meta: {dispatch: wrappedDispatch},
    };
    __DEV__ && logAction(updatedAction);
    return dispatch(updatedAction);
  }, []);

  return [state, wrappedDispatch];
}
