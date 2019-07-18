import { useState, useRef, useEffect, useReducer, useCallback } from 'react'
import { omit, pipe, filter, compose, nth, complement, isNil } from 'ramda'
import { objectDiff } from 'helpers/object';

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
