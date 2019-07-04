import { LayoutAnimation } from "react-native";

export const animationForCommandsMenu = {
  duration: 150,
  update: {
    property: LayoutAnimation.Properties.scaleXY,
    type: LayoutAnimation.Types.easeOut,
  },
  create: {
    property: LayoutAnimation.Properties.opacity,
    type: LayoutAnimation.Types.easeOut,
  },
  delete: {
    property: LayoutAnimation.Properties.opacity,
    type: LayoutAnimation.Types.easeOut,
  },
}
export const contentAnimation = (opening: boolean) => ({
  duration: opening ? 200 : 200,
  update: {
    property: LayoutAnimation.Properties.opacity,
    type: opening ? LayoutAnimation.Types.easeIn : LayoutAnimation.Types.easeOut,
  },
  create: {
    property: LayoutAnimation.Properties.scaleXY,
    type: opening ? LayoutAnimation.Types.easeIn : LayoutAnimation.Types.easeOut,
  },
})

export const focusItemAnimation = () => ({
  duration: 150,
  update: {
    property: LayoutAnimation.Properties.scaleXY,
    type: LayoutAnimation.Types.easeOut,
  },
  create: {
    property: LayoutAnimation.Properties.opacity,
    type: LayoutAnimation.Types.easeOut,
  },
})
