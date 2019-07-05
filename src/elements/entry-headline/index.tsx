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
  highlighted: false
}
// TODO create render props
function EntryHeadline(props: Props) {
  const headlineType = (props.colorized ? 'C' : 'R') + (props.highlighted ? 'H' : '')
  return (
    <Text style={styles[`h${props.level}${headlineType}`]}>
      {props.todo && (
        <Text style={[styles.todo, props.todo === 'DONE' ? styles.doneText : {}]}>
          {props.todo}{' '}
        </Text>
      )}

      {props.colorized && props.priority && <Text style={styles.priority}>[#{props.priority}] </Text>}

      <Text>{props.headline}</Text>

      {props.colorized && props.tags.length > 0 && <Text style={styles.tags}>:{props.tags.join(':')}:</Text>}
    </Text>
  )
}

EntryHeadline.defaultProps = defaultProps

export default memo(EntryHeadline)
