import React, { memo } from 'react'
import { Text } from 'react-native'

import styles from './styles'
import { OrgEntry } from 'core/entries/store/types'

type Props = {
  category: string
  now?: string
  baseLevel?: number
} & OrgEntry &
  typeof defaultProps

const defaultProps = {
  showDetails: false,
  colorized: true,
}
// TODO create render props
function EntryHeadline(props: Props) {
  return (
    <Text style={styles[`h${props.level}${props.colorized ? 'C' : 'R'}`]}>
      {props.todo && (
        <Text style={[styles.todo, props.todo === 'DONE' ? styles.doneText : {}]}>
          {props.todo}{' '}
        </Text>
      )}

      {props.colorized && props.priority && <Text style={styles.priority}>[#{props.priority}] </Text>}

      {/* <EntryContent content={props.headline} asHeadline={true} /> */}
      <Text>{props.headline}</Text>

      {props.colorized && props.tags.length > 0 && <Text style={styles.tags}>:{props.tags.join(':')}:</Text>}
    </Text>
  )
}

EntryHeadline.defaultProps = defaultProps

export default memo(EntryHeadline)
