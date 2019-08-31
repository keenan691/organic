import React, {useState, useCallback} from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import {TabView, SceneMap} from 'react-native-tab-view';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

const FirstRoute = () => (
  <View style={[styles.scene, {backgroundColor: '#ff4081'}]} />
);

const SecondRoute = () => (
  <View style={[styles.scene, {backgroundColor: '#673ab7'}]} />
);

function Search() {
  const [navigationState, setNavigationState] = useState({
    index: 0,
    routes: [{key: 'first', title: 'First'}, {key: 'second', title: 'Second'}],
  });
  const setNavigationCallback = useCallback(
    index =>
      setNavigationState(state => ({
        ...state,
        index,
      })),
    [],
  );
  return (
    <TabView
      navigationState={navigationState}
      renderScene={SceneMap({
        first: FirstRoute,
        second: SecondRoute,
      })}
      onIndexChange={setNavigationCallback}
      initialLayout={{width: Dimensions.get('window').width}}
    swipeEnabled={true}
    />
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});

export default Search;
