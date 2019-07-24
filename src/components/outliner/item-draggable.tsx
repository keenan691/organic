import React, { Component} from 'react'
import { View, TextInput, Text, LayoutAnimation } from 'react-native'
import { Icon, EntryHeadline } from 'elements'
import styles from './styles'
import { TouchableOpacity } from 'react-native-gesture-handler'
import ItemIndicator from './item-indicator'
import { BooleanDict } from 'components/entry-list/types'
import { foldAnimation } from './animations'
import { Refs } from '.';
import { INDENT_SIZE } from './constants';

type Props = {
  onItemIndicatorPress: (itemPosition: number) => void
  onItemPress: (itemPosition: number) => void
  onAddButtonPress: () => void
  hideDict: BooleanDict
  levels: number[]
  ordering: string[]
  refs: Refs
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
  hasHiddenChildren: false,
  contentVisibility: 'hidden' as 'hidden' | 'preview' | 'visible',
  showAddButtons: false,
  editedText: '',
})

class ItemDraggable extends Component<Props, State> {
  state = createState()

  activate = () => {
    setTimeout(() => {
      this.setState({
        itemState: 'active'
      })
      LayoutAnimation.configureNext(foldAnimation)
    }, 50)
  }
  edit = () => {
    this.setState({
      itemState: 'dragged',
    })
    LayoutAnimation.configureNext(foldAnimation)
    setTimeout(() => {
      this.setState({
        itemState: 'edit'
      })
    }, 200)
  }

  /* activate = () => {
   *   this.setState({itemState: 'active'})
   * } */

  changeText = (text: any) => {
    this.setState({ editedText: text })
  }

  onItemIndicatorPress = () => {
    this.props.onItemIndicatorPress(this.state.position)
    this.setState(prevState => ({
      hasHiddenChildren: !prevState.hasHiddenChildren
    }))
  }

  renderAddButtons = () => {
    const { onAddButtonPress } = this.props
    return (
      <View style={{ position: 'absolute', top: -15, zIndex: 4, left: 200 - INDENT_SIZE * this.state.level }}>
        <TouchableOpacity onPress={onAddButtonPress}>
          <Icon name="plusCircle" style={{ margin: 5 }} />
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const { item, level, position, editedText, itemState } = this.state
    const height = this.props.refs.current.itemHeights[position] - 2
    if (!item || itemState === 'inactive') return null
    return (
      <View style={[ styles.row , { height }]}>
        <ItemIndicator
          level={level}
          flatDisplay={true}
          position={position}
          onPress={this.onItemIndicatorPress}
          hasChildren={this.state.hasChildren}
          hasHiddenChildren={this.state.hasHiddenChildren}
        />
        <View style={styles.column}>
          <TouchableOpacity onPress={this.edit}>
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
