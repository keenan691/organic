/** @flow */

import React, { Component } from 'react';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import R from 'ramda';

import { Colors } from './';

export default {
  renderIcon: ({ route }) => (
    <Icon
      name={route.icon}
      size={32}
      style={{
        color: Colors.tabBarText,
      }}
    />
  ),
  getLabelText: ({ route }) => null,
  labelStyle: {
    color: Colors.tabBarText,
  },
  tabBar: {
    backgroundColor: Colors.tabBarBg,
    ...Platform.select({
      ios: {
        paddingTop: 20,
      },
      android: {},
    }),
  },
  style: {
    backgroundColor: Colors.tabBarBg,
    ...Platform.select({
      ios: {
        paddingTop: 20,
      },
      android: {},
    }),
  },
  indicatorStyle: {
    backgroundColor: Colors.primary,
  },
};
