import React, { useCallback } from 'react'
import { Subject } from 'rxjs'
import {
  PinchGestureHandlerGestureEvent,
  PinchGestureHandlerStateChangeEvent,
  State,
} from 'react-native-gesture-handler'
import { map, filter, bufferTime } from 'rxjs/operators'
import { Refs } from '.'
import { ItemData } from './types'
import {lessDetails, moreDetails} from "./useVisibility";

export function usePinchGesture(
  { levels, ordering, hideDict }: ItemData,
  data: Refs,
  setVisibility: React.Dispatch<React.SetStateAction<{}>>
) {
  const pinch$ = new Subject<PinchGestureHandlerGestureEvent>().pipe(
    map(event => event.nativeEvent)
  )
  const pinchState$ = new Subject<PinchGestureHandlerStateChangeEvent>().pipe(
    map(({ nativeEvent }) => nativeEvent.state),
    filter(state => state === State.ACTIVE)
  )

  const onPinchCallback = useCallback(event => pinch$.next(event), [levels, ordering, hideDict])
  const onPinchStateCallback = useCallback(event => pinchState$.next(event), [
    ordering,
    levels,
    hideDict,
  ])

  pinchState$.subscribe(state => {
    data.pinchGesture.isActive = true
  })

  pinch$
    .pipe(
      /* auditTime(100), */
      map(event => event.scale),
      bufferTime(100),
      map(scales => [scales[0] > scales[2] ? 'in' : 'out', scales[0]])
    )
    .subscribe(([direction, scale]) => {
      if (data.pinchGesture.isActive && scale > 0.5) {
        const transformVisibility = direction === 'in' ? lessDetails : moreDetails
        setVisibility(transformVisibility(ordering, levels, hideDict))
        data.pinchGesture.isActive = false
      }
    })

  return { onPinchCallback, onPinchStateCallback }
}
