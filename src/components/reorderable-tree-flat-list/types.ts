import { NumberDict } from "components/entry-list/types";
import { Animated } from "react-native";

export type Refs = {
  itemHeights: ItemHeightCache
  scrollPosition:  number
  temporaryItem: {
    translateY: typeof Animated.Value
    level: typeof Animated.Value
  }
  targetIndicator: {
    offset: typeof Animated.Value
    opacity: typeof Animated.Value
  }
  move: {
    fromPostion:  number | null
    toPostion:  number | null
  }
}

export type ItemHeightCache = NumberDict
