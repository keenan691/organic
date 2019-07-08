import { Animated } from "react-native";
import { getDraggableToTargetOffset } from "./selectors";
import { Refs } from "./types";

export const startShiftLevelAnimation = (data: Refs, toValue: number) => {
  if (!data.animating) {
    data.animating = true
    Animated.timing(data.draggable.level, {
      toValue,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      data.animating = false
    })
  }
}

export function startActivateAnimation(data: Refs) {
  Animated.timing(data.draggable.opacity, {
    toValue: 0.8,
    duration: 200,
    useNativeDriver: true,
  }).start()
}

export function startReleaseAnimation(data: Refs, ordering: string[]) {
  const dY = getDraggableToTargetOffset(data, ordering)
  Animated.sequence([
    Animated.timing(data.draggable.translateY, {
      toValue: dY,
      duration: 200,
      useNativeDriver: true,
    }),
    Animated.timing(data.draggable.opacity, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }),
  ]).start()
}
