---
to: storybook/stories/<%= h.changeCase.param(name) %>.tsx
---
import React from 'react'
import { storiesOf } from '@storybook/react-native'

import <%= h.changeCase.pascal(name) %> from 'view/components/<%= h.changeCase.param(name) %>'
import { create<%= h.changeCase.pascal(name) %> }Item from 'helpers/test-object-generator'

const Props: React.ComponentProps<typeof <%= h.changeCase.pascal(name) %>> = {
  items: [
    create<%= h.changeCase.pascal(name)Item %>({ path: undefined }),
  ],
  onItemPress: () => void,
  onItemLongPress: () => void,
}

storiesOf('<%= h.changeCase.title(name) %>', module).add('basic', () => <<%= h.changeCase.pascal(name) %> {...Props} />)
