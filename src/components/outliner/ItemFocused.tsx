import React, { useState, Fragment, useCallback, useImperativeHandle, useEffect, forwardRef } from 'react'
import { View, Text, LayoutAnimation, Keyboard } from 'react-native'
import { Icon, EntryHeadline } from 'elements'
import styles from './styles'
import { TouchableOpacity } from 'react-native-gesture-handler'
import ItemIndicator from './ItemIndicator'
import { BooleanDict } from 'components/entry-list/types'
import { foldAnimation } from './animations'
import { Refs } from '.'
import { INDENT_SIZE } from './constants'

type Props = {
  onItemIndicatorPress: (itemPosition: number) => void
  onItemPress: (itemPosition: number) => void
  onAddButtonPress: () => void
  focus: (index) => void
  hideDict: BooleanDict
  levels: number[]
  ordering: string[]
  refs: Refs
}

function ItemFocused(props: Props, ref) {
  const [state, setState] = useState({
    item: null as { headline: string; content: string; id: string } | null,
    level: 0,
    position: 0,
    itemState: 'inactive' as 'inactive' | 'active' | 'dragged' | 'edit',
    hasChildren: false,
    hasHiddenChildren: false,
    contentVisibility: 'hidden' as 'hidden' | 'preview' | 'visible',
    showAddButtons: false,
    editedText: '',
  })

  const mergeState = (toMerge) => setState((oldState) => {
      return ({ ...oldState, ...toMerge });
  })

  useImperativeHandle(ref, () => ({
    activate: () => {
      setTimeout(() => {
        LayoutAnimation.configureNext(foldAnimation)
        mergeState({ itemState: 'active'})
      }, 200)
    },

    edit: () => {
      mergeState({ itemState: 'dragged'})
      LayoutAnimation.configureNext(foldAnimation)
      setTimeout(() => {
        mergeState({ itemState: 'edit'})
        /* props.focus(state.position) */
      }, 200)
    },
    setState: (newState) => {
        return mergeState(newState);
    }
  }))


  const { item, level, position, itemState } = state
  const height = props.refs.current.itemHeights[position] - 2

  useEffect(() => {
    const deactivateEditState = () => {
      if (state.itemState !== 'edit') return

      // Back to previous position if edited item have an empty headline
      if (!item.headline) {
        props.deleteItems([state.position])
        props.activateItem(state.position)
      } else {
        props.changeItems([state.item])
      }

      // Animations
      mergeState({ itemState: 'dragged'})

      setTimeout(() => {
        mergeState({ itemState: 'active'})
        LayoutAnimation.configureNext(foldAnimation)
      }, 1)
    }

    const handler = Keyboard.addListener('keyboardDidHide', () => {
      deactivateEditState()
    })
    return () => handler.remove()
  }, [])

  const onItemIndicatorPress = useCallback(() => {
    props.onItemIndicatorPress(state.position)
    setState(prevState => ({
      ...prevState,
      hasHiddenChildren: !prevState.hasHiddenChildren,
    }))
  },[])

  const onSubmitCallback = useCallback(({ nativeEvent: { text } }) => {
    mergeState(prevState => ({
      item: {
        ...prevState,
        headline: text,
      },
    }))
    props.changeItems([
      {
        ...state.item,
        headline: text,
      },
    ])
  } ,[state.item])

  if (!item) return null
  const marginRight = (level-1) * INDENT_SIZE
  return (
    <View style={[styles.row, { height, marginRight}]}>
      <ItemIndicator
        level={level}
        flatDisplay={true}
        position={position}
        type={item.type}
        onPress={onItemIndicatorPress}
        hasChildren={state.hasChildren}
        hasHiddenChildren={state.hasHiddenChildren}
      />
      <View style={[styles.column, { justifyContent: 'center', height }]}>
        <TouchableOpacity onPress={item.type === 'file' ? props.refs.current.actions.open(item) : ref.current.edit}>
          <EntryHeadline
            editable={itemState === 'edit'}
            {...item}
            level={level}
            position={position}
            onSubmit={onSubmitCallback}
          />
          {item.content && itemState === 'active' && (
            <View>
              <Text style={styles.contentPreviewText} numberOfLines={1} ellipsizeMode={'tail'}>
                {item.content}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        { props.canAddItems && (itemState === 'active') && (
          <Fragment>
            <AddButtons
              direction="top"
              level={state.level}
              onAddButtonPress={props.onAddButtonPress}
            />
            <AddButtons
              direction="bottom"
              level={state.level}
              onAddButtonPress={props.onAddButtonPress}
            />
          </Fragment>
        )}
      </View>
      <TouchableOpacity onPress={() => null}>
          <Icon name="chevronRight" style={[{ margin: 5 }]} />
      </TouchableOpacity>
    </View>
  )
}

function AddButtons({
  direction,
  level,
  onAddButtonPress,
}: {
  direction: 'top' | 'bottom'
  level: number
  onAddButtonPress: () => void
}) {
  return (
    <View
      style={[
        {
          position: 'absolute',
          zIndex: 4,
          flexDirection: 'row',
          left: 200 - INDENT_SIZE * level,
        },
        { [direction]: -15 },
      ]}
    >
      <TouchableOpacity onPress={() => onAddButtonPress(direction)}>
        <Icon name="plusCircle" style={[{ margin: 5 }, styles[`h${level}C`]]} />
      </TouchableOpacity>
    </View>
  )
}

export default forwardRef(ItemFocused)
