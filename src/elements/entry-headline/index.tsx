import React, { memo } from 'react'
import { Text, View, TextInputChangeEventData } from 'react-native'

import styles from './styles'
import { OrgEntry } from 'core/entries/store/types'
import { TextInput } from 'react-native-gesture-handler'

type Props = {
  category: string
  now?: string
  baseLevel?: number
  changeText: () => void
} & OrgEntry &
  typeof defaultProps

const defaultProps = {
  showDetails: false,
  colorized: true,
  highlighted: false,
  editable: false
}

function EntryHeadline(props: Props) {
  return (
    <View
      pointerEvents={!props.editable ? 'none' : 'auto'}>
      {props.editable ? (
        <TextInput
          style={[styles[`h${props.level}C`], { padding: 0 }]}
          onChangeText={props.changeText}
          value={props.headline}
          selectTextOnFocus
          autoFocus
        />
      ) : (
        <Text style={styles[`h${props.level}C`]}>{props.headline}</Text>
      )}
    </View>
  )
}
/*
 * {props.todo && (
 *   <Text style={[styles.todo, props.todo === 'DONE' ? styles.doneText : {}]}>
 *     {props.todo}{' '}
 *   </Text>
 * )}
 *
 * {props.colorized && props.priority && <Text style={styles.priority}>[#{props.priority}] </Text>}
 * {props.colorized && props.tags.length > 0 && <Text style={styles.tags}>:{props.tags.join(':')}:</Text>}
 *  */
EntryHeadline.defaultProps = defaultProps

export default EntryHeadline
