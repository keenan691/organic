import React from 'react'
import { Options } from 'react-native-navigation';
import { View, Text, StyleSheet } from 'react-native'
import Editor from 'components/editor';
import { editorProps } from '../../../fixtures/entries';
import { useSelector } from 'react-redux';
import { sourcesSelectors } from 'redux/sources';

type Props = {
  componentId: string;
};

export default function Home({componentId}: Props) {
  const sources = useSelector(sourcesSelectors.getData)
  const workspaces = sources.map((source) => ({
    level: 1,
    id: source.id,
    headline: source.basename,
    type: 'file',
  }))
  // TODO add workspaces
  return (
    <Editor workspaces={ workspaces } entries={ [] }/>
  )
}

Home.options = (): Options => ({
  topBar: {
    title: {
      text: 'Home Screen',
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
