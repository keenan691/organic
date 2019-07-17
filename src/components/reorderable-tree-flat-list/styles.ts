import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics } from 'view/themes'
import { headlineStyles } from 'view/styles/levels';
import globalStyles from 'view/styles/global';

export default StyleSheet.create({
  ...globalStyles,
  ...headlineStyles,
  targetIndicator: {
      height: 1,
      width: '100%',
    backgroundColor: Colors.blue,
      position: 'absolute',
      zIndex: 1,
  },
  temporaryItem: {
    width: '100%',
    position: 'absolute',
    backgroundColor: Colors.lightGray,
    opacity: 0.8,
    zIndex: 2,
  },
})
