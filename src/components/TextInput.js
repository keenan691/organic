import { TextInput, View } from 'react-native';
import React, { Component } from "react";
import { Colors, Metrics, Fonts } from '../themes';

class CustomizedTextInput extends Component {
  focus() {
    this.textInput.focus()
  }
  blur() {
    this.textInput.blur()
  }
  render() {
    return (
        <TextInput
          ref={view => (this.textInput = view)}
          underlineColorAndroid={Colors.menuButton}
          placeholderTextColor={Colors.base1}
          style={{
            fontSize: Fonts.size.regular,
            color: Colors.primary,
            ...this.props.style,

          }}
          {...this.props}
          />
    );
  };

}
export default CustomizedTextInput;
