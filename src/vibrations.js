/** @flow */

import { Vibration } from 'react-native';
import R from "ramda";

export const vibrate = (val=10) => Vibration.vibrate(val)
