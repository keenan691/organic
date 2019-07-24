import { useCallback } from 'react'
import { Subject } from 'rxjs'
import { Refs, AnimatedValues } from '.'

export function useScroll(data: Refs, animatedValues: AnimatedValues) {
  const scroll$ = new Subject()
  const onScrollEventCallback = useCallback(event => scroll$.next(event), [])

  scroll$.subscribe(({ nativeEvent: { contentOffset } }) => {
    const height = contentOffset.y | 0
    const baseLevel = data.lastOffset - height
    data.scrollPosition = height
  })

  return onScrollEventCallback
}
