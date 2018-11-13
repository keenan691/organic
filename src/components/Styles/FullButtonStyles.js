import { StyleSheet } from 'react-native'
import { Fonts, Colors } from '../../themes/'

export default StyleSheet.create({
  button: {
    marginVertical: 5,
    borderTopColor: Colors.base03,
    borderBottomColor: Colors.base03,
    borderTopWidth: 3,
    borderBottomWidth: 3,
    backgroundColor: Colors.cyan
  },
  buttonText: {
    margin: 18,
    textAlign: 'center',
    color: Colors.base3,
    fontSize: Fonts.size.medium,
    fontFamily: Fonts.type.bold
  }
})
