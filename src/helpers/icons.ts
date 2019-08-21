import { PixelRatio } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const navIconSize = __DEV__ === false && Platform.OS === "android" ? PixelRatio.getPixelSizeForLayoutSize(40) : 40;
const replaceSuffixPattern = /--(active|big|small|very-big)/g;

const icons = {
  "add-circle": [30],
};

const iconsMap = {};
const iconsLoaded = new Promise((resolve, reject) => {
  Promise.all(
    Object.keys(icons).map(iconName =>
      // IconName--suffix--other-suffix is just the mapping name in iconsMap
      MaterialIcons.getImageSource(iconName.replace(replaceSuffixPattern, ""), icons[iconName][0], icons[iconName][1])
    )
  ).then(sources => {
    Object.keys(icons).forEach((iconName, idx) => (iconsMap[iconName] = sources[idx]));

    // Call resolve (and we are done)
    resolve(true);
  });
});

export { iconsMap, iconsLoaded };
