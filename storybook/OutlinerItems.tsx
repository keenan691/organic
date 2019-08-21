import React, {Component} from 'react';
import {View} from 'react-native';
import Item from 'components/outliner/Item';
import {Headline, Divider} from 'react-native-paper';
import Chance from 'chance';

const chance = new Chance('seed')

const commonProps = {
  headline: chance.sentence({words: 2}),
  type: 'entry',
  hasChildren: true,
  level: 1,
  hasHiddenChildren: true,
  onItemLayoutCallback: () => null,
  onItemIndicatorPress: () => null,
};

export default class OutlinerItems extends Component {
  render() {
    return (
      <View>
        <Headline>Files & Workspaces</Headline>
        <Divider/>
        <Item {...commonProps} type="file" />
        <Item {...commonProps} type="workspace" level={2} />
        <Item {...commonProps} type="workspace" level={2} />
        <Divider/>
        <Headline>Entries</Headline>
        <Divider/>
        <Item {...commonProps} level={1} />
        <Item {...commonProps} level={2} />
        <Item {...commonProps} level={3} />
        <Item {...commonProps} level={4} />
        <Item {...commonProps} level={5} />
        <Item {...commonProps} level={6} />
        <Item {...commonProps} level={7} />
      </View>
    );
  }
}
