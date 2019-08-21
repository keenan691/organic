import React, { memo, useState, useEffect } from 'react'
import { Text, View, TextInputChangeEventData } from 'react-native'

import styles from './styles'
import { OrgEntry } from 'modules/entries/store/types'
import { TextInput } from 'react-native-gesture-handler'
import { Colors } from 'themes';
import { getItemColor } from 'themes/org-colors';

type Props = {
  category: string
  now?: string
  baseLevel?: number
  onSubmit?: (text: string ) => void
} & OrgEntry &
  typeof defaultProps

const defaultProps = {
  showDetails: false,
  highlighted: false,
  editable: false,
  fontSize:  14,
  type: 'headline' as 'headline' | 'project' | 'habit' | 'task' | 'file' | 'workspace',
}


function EntryHeadline(props: Props) {
  const { headline, type, level } = props
  const textStyles = [{ color: getItemColor({level, type})}]

  switch (type) {
    case 'file':
      textStyles.push(styles.file)
      break;
  }

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
