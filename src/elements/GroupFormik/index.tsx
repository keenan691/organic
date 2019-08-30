import {Headline} from 'react-native-paper'
import {View} from 'react-native'
import React from 'react'

type Props = {
  title: string
  children: any
}

function GroupFormik(props: Props) {
  return (
    <View>
      <Headline>{props.title}</Headline>
      {props.children}
    </View>
  )
}

export default GroupFormik
