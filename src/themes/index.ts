import {DefaultTheme} from 'react-native-paper';
import Colors from './Colors';
import Fonts from './Fonts';
import Metrics from './Metrics';
import ApplicationStyles from './ApplicationStyles';

const Theme = {
  colors: {
    ...DefaultTheme.colors,
  },
};
const colors = DefaultTheme.colors

export {
  colors,
    Colors,
    Fonts,
    Metrics,
    ApplicationStyles
}

export default Theme;
