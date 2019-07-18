import { NumberDict } from "components/entry-list/types";
import { Animated } from "react-native";

export type Refs = {
  itemHeights: ItemHeightCache
  scrollPosition:  number
  draggable: {
    translateY: typeof Animated.Value
    levelOffset:  number
    level: typeof Animated.Value
    opacity: typeof Animated.Value
  }
  targetIndicator: {
    translateY: typeof Animated.Value
    opacity: typeof Animated.Value
  }
  move: {
    fromPosition:  number | null
    toPosition:  number | null
    toLevel:  number | null
  }
}

export type ItemHeightCache = NumberDict
