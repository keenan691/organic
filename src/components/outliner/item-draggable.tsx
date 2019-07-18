import React, { Component } from 'react'
import { View, TextInput } from 'react-native'
import { Icon } from 'elements'
import styles from './styles'
import { TouchableOpacity } from 'react-native-gesture-handler'
import ItemIndicator from './item-indicator'
import { BooleanDict } from 'components/entry-list/types';

type Props = {
  onItemIndicatorPress: (itemPosition: number) => void
  onItemPress: (itemPosition: number) => void
  onAddButtonPress: () => void
  hideDict: BooleanDict
  levels: number[]
  ordering: string[]
  renderItem: (obj: any) => React.ReactNode
}

type State = ReturnType<typeof createState>
const createState = () => ({
  item: null as { headline:  string} | null,
  level: 0,
  position: 0,
  editable: false,
  hasChildren: false,
  editedText: '',
})

class ItemDraggable extends Component<Props, State> {
  state = createState()

  setNativeProps = (newState: any) => {
    this.setState({ ...newState, editable: false })
  }

  edit = () => {
    this.setState(prevState => ({
      editable: true,
      editedText: (prevState.item && prevState.item.headline) || '',
    }))
  }

  changeText = (text: any) => {
    this.setState({ editedText: text })
  }

  onItemIndicatorPress = () => {
    this.props.onItemIndicatorPress(this.state.position)
    this.setState((prevState) => ({
      hasChildren: !prevState.hasChildren
    }))
  }

  render() {
    const { item, level, position, editedText } = this.state
    const { renderItem, onAddButtonPress } = this.props
    if (!item) return null
    return (
      <View style={styles.item}>
        <View style={{ position: 'absolute', top: -15, zIndex: 4, left: 200 }}>
          <TouchableOpacity onPress={onAddButtonPress}>
            <Icon name="plusCircle" style={{ margin: 5 }} />
          </TouchableOpacity>
        </View>
        <ItemIndicator
          level={level}
          flatDisplay={true}
          position={position}
          onPress={this.onItemIndicatorPress}
          hasChildren={this.state.hasChildren}
        />
        {this.state.editable ? (
          <TextInput
            style={[styles[`h${level}C`], { padding: 0 }]}
            onChangeText={this.changeText}
            value={editedText}
            autoFocus
          />
        ) : (
          <TouchableOpacity onPress={this.edit}>
            {renderItem({
              item,
              level,
              position,
              editable: this.state.editable,
              defaultAction: this.edit,
            })}
          </TouchableOpacity>
        )}
      </View>
    )
  }
}

export default ItemDraggable
