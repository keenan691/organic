import { DrawerItems } from 'react-navigation';
import { Text, View } from 'react-native';
import React, { PureComponent } from 'react';
import styles from './Styles/DrawerContentStyles'

class DrawerContent extends PureComponent {

  render() {
    return (
      <View style={styles.drawer}>
        <Text style={styles.titleText}>Marks</Text>
        <DrawerItems {...this.props} />
      </View>
    );
  }
}

export default DrawerContent;
