import { Animated } from "react-native";
import { getDraggableToTargetOffset, getItemLevelOffset } from "./selectors";
import { Refs } from "./types";
import { LayoutAnimation } from "react-native";

export const foldAnimation = {
  duration: 150,
  update: {
    property: LayoutAnimation.Properties.scaleXY,
    type: LayoutAnimation.Types.easeOut,
  },
  create: {
    property: LayoutAnimation.Properties.scaleXY,
    type: LayoutAnimation.Types.easeOut,
  },
  delete: {
    property: LayoutAnimation.Properties.scaleXY,
    type: LayoutAnimation.Types.easeOut,
  },
}

export const startShiftLevelAnimation = (data: Refs) => {
  if (!data.animating) {
    data.animating = true
    const toValue = getItemLevelOffset(data.move.toLevel)
    Animated.timing(data.draggable.level, {
      toValue,
      duration: 70,
      useNativeDriver: true,
    }).start(() => {
      data.animating = false
    })
  }
}

export function startActivateAnimation(data: Refs) {
  Animated.timing(data.draggable.opacity, {
    toValue: 1,
    duration: 200,
    useNativeDriver: true,
  }).start()
}

export function startReleaseAnimation(data: Refs, ordering: string[], visibility: {}) {
  const dY = getDraggableToTargetOffset(data, ordering, visibility)
  Animated.sequence([
    Animated.timing(data.draggable.translateY, {
      toValue: dY,
      duration: 200,
      useNativeDriver: true,
    }),
    Animated.timing(data.draggable.opacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }),
  ]).start()
}
