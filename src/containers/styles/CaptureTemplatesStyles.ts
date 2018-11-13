import { Dimensions, StyleSheet } from 'react-native';

import { ApplicationStyles, Colors, Fonts, Metrics } from '../../themes';

const NUM_COLUMNS = 3;
const ITEM_BORDER_WIDTH = 1;

const itemWidth = Dimensions.get('window').width / NUM_COLUMNS - 1.4;
const itemHeight = itemWidth;
const itemBorder = {
  backgroundColor: Colors.bg,
  borderColor: Colors.separator,
  // borderWidth: ITEM_BORDER_WIDTH
};

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  special: {
    color: Colors.violet,
  },
  item: {
    ...itemBorder,
    padding: Metrics.baseMargin,
    width: itemWidth,
    height: itemHeight,
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTitle: {
    color: Colors.fileText,
    fontSize: Fonts.size.regular,
    textAlign: 'center',
  },
  contentContainer: {
    padding: Metrics.baseMargin,
  },
  selected: {
    backgroundColor: Colors.green,
  },
});
