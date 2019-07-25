import React from 'react'
import { Text, View } from 'react-native'
import { Icon } from 'elements';

import ActionButton from 'react-native-action-button'

type Props = {} & typeof defaultProps

const defaultProps = {}

function BatchEditActions(props: Props) {
  return (
    <View>
      <ActionButton
        backgroundTappable={true}
        verticalOrientation="down"
        offsetY={100}
        active={true}
        buttonColor="rgba(231,76,60,1)"
      >
        <ActionButton.Item
          buttonColor="#9b59b6"
          title="New Task"
          onPress={() => console.log('notes tapped!')}
        >
          <Icon name="bullseye" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item buttonColor="#3498db" title="Notifications" onPress={() => {}}>
          <Icon name="bullseye" style={styles.actionButtonIcon} />
        </ActionButton.Item>
      </ActionButton>
    </View>
  )
}

BatchEditActions.defaultProps = defaultProps

export default BatchEditActions
