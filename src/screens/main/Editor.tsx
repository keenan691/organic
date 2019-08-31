import React from 'react';
import {Options} from 'react-native-navigation';
import {View, Text, StyleSheet} from 'react-native';
import {FAB} from 'react-native-paper';

type Props = {
  componentId: string;
};

export default function Editor({componentId}: Props) {
  return null
}

Editor.options = (): Options => ({
  topBar: {
    title: {
      text: 'Editor Screen',
    },
  },
});

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  page: {
    flex: 1,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
});
