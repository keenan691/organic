import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {Options} from 'react-native-navigation';
import {
  Headline,
  ActivityIndicator,
  Subheading,
  Caption,
} from 'react-native-paper';
import Theme from 'themes';
import {useDispatch} from 'react-redux';
import {startupActions} from 'redux/startup';

type Props = {};

export default function Splash(prop: Props) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(startupActions.startup.request());
  }, []);

  return (
    <View style={styles.page}>
      <View style={styles.sectionContainer}>
        <Headline>ORGANIC</Headline>
        <Subheading>from chaos to organisation</Subheading>
        <ActivityIndicator
          animating={true}
          color={Theme.colors.primary}
          size="large"
        />
        <Caption>loading...</Caption>
      </View>
    </View>
  );
}

Splash.options = (): Options => ({
  topBar: {
    visible: false,
  },
});

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
});
