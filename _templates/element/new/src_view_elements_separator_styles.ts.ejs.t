---
to: src/elements/<%= h.changeCase.param(name) %>/styles.ts
---
import { StyleSheet } from 'react-native'
import { ApplicationStyles } from 'view/themes'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
})
