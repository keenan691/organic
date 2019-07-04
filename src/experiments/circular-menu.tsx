import React from 'react'
import { Text, View } from 'react-native'
import CricularActionButton from 'react-native-circular-action-menu'

type Props = {} & typeof defaultProps

const defaultProps = {}

function CircularMenu(props: Props) {
  return (
    <View>
      <CricularActionButton position="center" buttonColor={mode === 'outline' ? 'green' : 'red'}>
        <CricularActionButton.Item
          buttonColor="#9b59b6"
          title="New Task"
          onPress={() => console.log('notes tapped!')}
        >
          <Icon name="bullseye" style={styles.actionButtonIcon} />
        </CricularActionButton.Item>
        <CricularActionButton.Item
          buttonColor="#9b59b6"
          title="New Task"
          onPress={() => console.log('notes tapped!')}
        >
          <Text>sdf</Text>
        </CricularActionButton.Item>
        <CricularActionButton.Item
          buttonColor="#9b59b6"
          title="New Task"
          onPress={() => console.log('notes tapped!')}
        >
          <Text>sdf</Text>
        </CricularActionButton.Item>
      </CricularActionButton>{' '}
    </View>
  )
}

CircularMenu.defaultProps = defaultProps

export default CircularMenu
