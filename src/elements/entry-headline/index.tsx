import React, { memo, useState, useEffect } from 'react'
import { Text, View, TextInputChangeEventData } from 'react-native'

import styles from './styles'
import { OrgEntry } from 'core/entries/store/types'
import { TextInput } from 'react-native-gesture-handler'
import { Colors } from 'view/themes';

type Props = {
  category: string
  now?: string
  baseLevel?: number
  fontSize:  number
  onSubmit?: (text: string ) => void
} & OrgEntry &
  typeof defaultProps

const defaultProps = {
  showDetails: false,
  colorized: true,
  highlighted: false,
  editable: false
}

function EntryHeadline(props: Props) {
  const { fontSize, level, headline } = props
  const textStyles = [styles[`h${level}C`], fontSize && {fontSize}]

  const [text, setText] = useState(props.headline)

  useEffect(() => {
    setText(headline)
  }  ,[headline])

  return (
    <View
      pointerEvents={!props.editable ? 'none' : 'auto'}>
      {props.editable ? (
        <TextInput
          style={[...textStyles, { padding: 0 }]}
          onChangeText={setText}
          onSubmitEditing={props.onSubmit}
          value={text}
          selectTextOnFocus
          autoFocus
        selectionColor={Colors.darkerGray}
        />
      ) : (
        <Text style={textStyles}>{props.headline}</Text>
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
