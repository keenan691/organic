import React, { Component } from 'react'
import { View, TextInput, Text, LayoutAnimation } from 'react-native'
import { Icon, EntryHeadline } from 'elements'
import styles from './styles'
import { TouchableOpacity } from 'react-native-gesture-handler'
import ItemIndicator from './item-indicator'
import { BooleanDict } from 'components/entry-list/types'
import { foldAnimation } from './animations'

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
  item: null as { headline: string; content: string } | null,
  level: 0,
  position: 0,
  editable: false,
  itemState: 'inactive' as 'inactive' | 'active' | 'dragged' | 'edit',
  hasChildren: false,
  contentVisibility: 'hidden' as 'hidden' | 'preview' | 'visible',
  showAddButtons: false,
  editedText: '',
})

class ItemDraggable extends Component<Props, State> {
  state = createState()

  edit = () => {
    LayoutAnimation.configureNext(foldAnimation)
    this.setState({
      itemState: 'edit',
    })
  }

  changeText = (text: any) => {
    this.setState({ editedText: text })
  }

  onItemIndicatorPress = () => {
    this.props.onItemIndicatorPress(this.state.position)
    this.setState(prevState => ({
      hasChildren: !prevState.hasChildren,
    }))
  }

  renderAddButtons = () => {
    const { onAddButtonPress } = this.props
    return (
      <View style={{ position: 'absolute', top: -15, zIndex: 4, left: 200 }}>
        <TouchableOpacity onPress={onAddButtonPress}>
          <Icon name="plusCircle" style={{ margin: 5 }} />
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const { item, level, position, editedText, itemState } = this.state
    if (!item || itemState === 'inactive') return null
    return (
      <View style={styles.row}>
        <ItemIndicator
          level={level}
          flatDisplay={true}
          position={position}
          onPress={this.onItemIndicatorPress}
          hasChildren={this.state.hasChildren}
        />
        <View style={styles.column}>
          <TouchableOpacity onPress={this.props.editItem}>
            <EntryHeadline
              colorized={true}
              editable={itemState === 'edit'}
              {...item}
              level={level}
              position={position}
            />
            {item.content && itemState === 'active' && (
              <View>
                <Text style={styles.contentPreviewText} numberOfLines={1} ellipsizeMode={'tail'}>
                  {item.content}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          {itemState === 'active' && this.renderAddButtons()}
        </View>
      </View>
    )
  }
}

export default ItemDraggable
