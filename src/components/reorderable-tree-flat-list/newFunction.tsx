import { Refs } from './types';
export function newFunction({ data, fromPosition }: {
    data: Refs;
    fromPosition: any;
}) {
    return data.move.toPosition > fromPosition ? data.move.toPosition - 1 : data.move.toPosition;
}
import React from 'react'
import { Text, View } from 'react-native'

type Props = {} & typeof defaultProps

const defaultProps = {}

function NewFunction(props: Props) {
  return (
    <View>
      <Text>NewFunction Component</Text>
    </View>
  )
}

NewFunction.defaultProps = defaultProps

export default NewFunction
