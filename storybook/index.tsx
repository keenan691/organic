import React, {Component, Fragment} from 'react';
import OutlinerItems from './OutlinerItems';
import {Picker, View} from 'react-native';
import {Divider, Drawer} from 'react-native-paper';
import {editorProps} from '../fixtures/entries';
import Editor from 'components/editor';

export default class StorybookUIHMRRoot extends Component {
  state = {
    component: 'items',
    active: 'first'
  };
  render() {
    const { active } = this.state;
    return (
      <Fragment>
        <Drawer.Section title="Some title">
          <Drawer.Item
            label="First Item"
            active={active === 'first'}
            onPress={() => { this.setState({ active: 'first' }); }}
          />
          <Drawer.Item
            label="Second Item"
            active={active === 'second'}
            onPress={() => { this.setState({ active: 'second' }); }}
          />
        </Drawer.Section>
        <Picker
          selectedValue={this.state.component}
          style={{height: 50, width: 300}}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({component: itemValue})
          }>
          <Picker.Item label="Items" value="items" />
          <Picker.Item label="Editor" value="editor" />
        </Picker>
        <Divider />
        {
          {
            items: <OutlinerItems />,
            editor: <Editor {...editorProps} />,
          }[this.state.component]
        }
      </Fragment>
    );
  }
}
