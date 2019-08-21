import React, {useCallback, Component} from 'react';
import {Options, Navigation} from 'react-native-navigation';
import {SafeAreaView, StyleSheet, View, Button, Text} from 'react-native';
import { createEntryListItem, generateRandomEntries, editorProps } from '../../fixtures/entries';
import Editor from 'components/editor';

type Props = {
  componentId: string;
};


export default function Main({componentId}: Props) {
  return (
    <Editor {...editorProps} />
  );
}


Main.options = (): Options => ({
  topBar: {
    title: {
      text: 'Editor Screen',
    },
  },
});

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
});
