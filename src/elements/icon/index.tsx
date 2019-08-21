import React from 'react'
import { View, Text } from 'react-native'
import styles from './styles'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Colors } from 'themes';

type Props = {
  name: keyof typeof Icons
  style?: object
}

function Icon (props: Props) {
  return (
    <View  style={props.style}>
      <FontAwesome size={8} name={props.name} color={Colors.lightGray} containerStyle ={{ flex: 1, justifyContent: 'center', alignSelf:'center'}}/>
    </View>
  )
}

export default Icon
