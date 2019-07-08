import React from 'react'
import { View, Text } from 'react-native'
import styles from './styles'
import FontAwesome, { Icons } from 'react-native-fontawesome'

type Props = {
  name: keyof typeof Icons
  style?: object
}

function Icon (props: Props) {
  return (
    <View>
      <FontAwesome style={props.style}>{Icons[props.name]}</FontAwesome>
    </View>
  )
}

export default Icon
