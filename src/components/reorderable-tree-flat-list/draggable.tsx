import React, { Component } from 'react'
import { View, TextInput } from 'react-native'
import { Icon } from 'elements'
import styles from './styles'
import { TouchableOpacity } from 'react-native-gesture-handler'
import LevelIndicator from './level-indicator';

type Props = {
  level: number
  position: number
  onPress: (itemPosition: number) => void
  hasHiddenChildren: boolean
  item: object
  dataRefs: object
  onAddButtonPress: () => void
} & typeof defaultProps

const defaultProps = {
  text: '',
}

class Draggable extends Component {
  state = {
    item: null,
    level: 0,
    position: 0,
    editable: false,
    editedText: '',
  }

  setNativeProps = newState => {
    this.setState({ ...newState, editable: false })
  }

  edit = () => {
    this.setState(prevState => ({
      editable: true,
      editedText: prevState.item.headline,
    }))
  }

  changeText = text => {
    this.setState({ editedText: text })
  }

  render() {
    const { item, level, position, editedText } = this.state
    const { onPress, renderItem, onAddButtonPress } = this.props
    if (!item) return null
    return (
      <View style={styles.item}>
        <View style={{ position: 'absolute', top: -15, zIndex: 4, left: 200 }}>
          <TouchableOpacity
            onPress={onAddButtonPress}
          >
            <Icon name="plusCircle" style={{ margin: 5 }} />
          </TouchableOpacity>
        </View>
        <LevelIndicator
          level={level}
          flatDisplay={true}
          position={position}
          onPress={onPress}
          hasHiddenChildren={false}
        />
        {this.state.editable ? (
          <TextInput
            style={[styles[`h${level}C`], { padding: 0 }]}
            onChangeText={this.changeText}
            value={editedText}
            autoFocus
          />
        ) : (
          renderItem({
            item,
            level,
            position,
            editable: this.state.editable,
            defaultAction: this.edit,
          })
        )}
      </View>
    )
  }
}

Draggable.defaultProps = defaultProps

export default Draggable
