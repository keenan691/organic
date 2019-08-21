import { Dimensions, StyleSheet } from 'react-native';
import { ApplicationStyles, Metrics, Colors, Fonts } from 'themes';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    alignItems: 'center',
    flex: 1,
    height: Dimensions.get('window').height / 2,
    margin: Metrics.doubleBaseMargin,
  },
  header: {
    marginTop: 15,
    marginBottom: 4,
    color: Colors.green,
    fontSize: Fonts.size.h3,
  },
  content: {
    ...Fonts.style.normal,
    margin: 22,
    color: Colors.fileText,
  },
});
