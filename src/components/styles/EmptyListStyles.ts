import { Dimensions, StyleSheet } from 'react-native';

import { Fonts } from '../../themes';
import { Metrics, Colors, ApplicationStyles } from '../../themes/';
import { shadeBlend } from '../../utils/functions';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    // justifyContent: "center",
    alignItems: 'center',
    flex: 1,
    height: Dimensions.get('window').height / 2,
    margin: Metrics.doubleBaseMargin,
  },
  header: {
    // ...Fonts.style.h3,
    // marginVertical: Metrics.doubleBaseMargin,
    // color: Colors.magenta,

    marginTop: 15,
    marginBottom: 4,
    color: Colors.green,
    fontSize: Fonts.size.h3,
    // fontWeight: 'bold'
  },
  content: {
    ...Fonts.style.normal,
    margin: 22,
    color: Colors.fileText,
  },
});
