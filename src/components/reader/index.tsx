import React, { forwardRef } from 'react'

import Outliner from 'components/outliner'
import Item from './Item'
import { Empty } from 'elements'
import STRINGS from 'constants/strings'

type Props = {}

function ContentReader(
  props: Props,
  ref: ((instance: unknown) => void) | React.RefObject<unknown> | null | undefined
) {
  return (
    <Outliner
      ItemComponent={Item}
      ListEmptyComponent={EmptyList}
      initialNumToRender={30}
      maxToRenderPerBatch={30}
      windowSize={3}
      updateCellsBatchingPeriod={200}
      ref={ref}
      {...props}
    />
  )
}

const EmptyList = (
  <Empty itemName={STRINGS.entry.namePlural} message={STRINGS.entry.emptyDescription} />
)

export default forwardRef(ContentReader)
