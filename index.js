// entry point for android
// import App from './src/app';

console.log('MAIN IDX START')
import {AppRegistry} from 'react-native';
import App from './src';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
console.log('MAIN IDX END')
