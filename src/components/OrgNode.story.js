import React, { Component } from 'react'
import { storiesOf } from "@storybook/react-native";
import OrgNode from "./OrgNode";

// timestamps: [
//   {
//     type: t.type,
//     warningPeriod: t.warningPeriod,
//     repeater: t.repeater,
//     date: t.date,
//     dateRangeEnd: t.dateRangeEnd}
// ]

const createNode = (level=1, todo='TODO', priority='A', tags=['tag1', 'tag2']) => ({
  id: '123',
  level,
  headline: 'This is sample headline',
  content: 'Node content. Nullam eu ante vel est convallis dignissim.  Fusce suscipit, wisi nec facilisis facilisis, est dui fermentum leo, quis tempor ligula erat quis odio.  Nunc porta vulputate tellus.  Nunc rutrum turpis sed pede.  Sed bibendum.  Aliquam posuere.  Nunc aliquet, augue nec adipiscing interdum, lacus tellus malesuada massa, quis varius mi purus non odio.  Pellentesque condimentum, magna ut suscipit hendrerit, ipsum augue ornare nulla, non luctus diam neque sit amet urna.  Curabitur vulputate vestibulum lorem.  Fusce sagittis, libero non molestie mollis, magna orci ultrices dolor, at vulputate neque nulla lacinia eros.  Sed id ligula quis est convallis tempor.  Curabitur lacinia pulvinar nibh.  Nam a sapien. ',
  category: 'Sample category',
  todo,
  isClosed: todo === 'DONE',
  priority,
  drawers: '',
  tags,
})

export default class OrgNodeWrapper extends Component {
  render () {
    return (<OrgNode item={createNode()} />)
  }
}
storiesOf('OrgNode', module)
  .add('Level 1, TODO, Priority and tags', () => <OrgNodeWrapper/>)
