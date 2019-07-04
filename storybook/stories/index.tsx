import { configure } from '@storybook/react-native'

configure(() => {
  require('./entry-list')
  require('./file-list')
  require('./experiments')
}, module)
