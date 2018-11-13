import { Vibration } from 'react-native';

export const vibrate = (val = 10) => Vibration.vibrate(val);
