/*
This file defines styles for demo screens in this project
You don't have to include this in your own project
or you can put styling sheets anywhere you like
*/

import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  bigText: {
    fontSize: 20,
  },
  item: {
    margin: 20,
  },
  text: {
    width: '75%',
    color: '#333333',
    marginBottom: 5
  },
  icon: {
    backgroundColor: 'transparent',
    color: 'white'
  },
  tabBar: {
    ...Platform.select({
      ios: {
        paddingTop: 20
      },
      android: {}
    })
  }
});

export default styles;
