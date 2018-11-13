// * ReduxTextInput.tsx

// ** License

/**
 * Copyright (C) 2018, Bartłomiej Nankiewicz<bartlomiej.nankiewicz@gmail.com>
 *
 * This file is part of Organic.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// ** Imports

import React, { PureComponent } from 'react';
import { TextInput } from 'react-native';

// ** Shape

interface ReduxTextInputProps {
  captureRoute: { routes: object[]; index: number };
  input: {
    name: string;
    value: any;
    onChange: () => void;
    onBlur: () => void;
    onFocus: () => void;
  };
  isModalVisible: boolean;
  navigationStack: string;
}

// ** Component

export class ReduxTextInput extends PureComponent<ReduxTextInputProps> {
  shouldComponentUpdate(nextProps: ReduxTextInputProps) {
    const { navigationStack } = nextProps;
    // Components traces navigation stack. Those fields only works in capture route
    if (navigationStack !== 'capture') {
      return false;
    }
    return true;
  }

  componentDidUpdate(prevProps: ReduxTextInputProps) {
    const {
      captureRoute: { routes, index },
      input,
      isModalVisible,
      navigationStack,
    } = this.props;

    // Stop if updated field don't belongs to current capture navigation route
    if (input.name !== routes[index].key) {
      return;
    }

    if (this.timeoutUpdate) {
      clearTimeout(this.timeoutUpdate);
    }

    this.timeoutUpdate = setTimeout(() => {
      this.input.setNativeProps({
        text: this.props.input.value,
      });
    }, 100);

    const prevIndex = prevProps.captureRoute.index;

    if (isModalVisible !== prevProps.isModalVisible) {
      // Focus on modal change
      isModalVisible ? this.input.blur() : this.input.focus();
    } else if (index !== prevIndex) {
      // Focus on capture route change
      this.input.focus();
    } else if (navigationStack != prevProps.navigationStack) {
      // Focus on main navigation stack change
      this.input.focus();
    }
  }

  render() {
    const { input: { onChange, onBlur, onFocus }, ...rest } = this.props;
    return (
      <TextInput
        ref={(view) => (this.input = view)}
        onChangeText={onChange}
        blurOnSubmit={false}
        onBlur={onBlur}
        onFocus={onFocus}
        {...rest}
      />
    );
  }
}
