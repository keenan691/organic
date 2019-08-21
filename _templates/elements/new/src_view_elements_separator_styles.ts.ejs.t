---
to: src/elements/<%= h.changeCase.pascal(name) %>/styles.ts
---
import { StyleSheet } from 'react-native'
import { ApplicationStyles } from 'view/themes'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
})
