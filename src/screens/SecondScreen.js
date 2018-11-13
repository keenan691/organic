import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import styles from './styles/styles';

class SecondScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.bigText}>Second Screen</Text>
        <Text style={styles.text}>{this.props.message}</Text>
      </View>
    );
  }
}

// const mapStateToProps = state => {
//   return {
//     message: state._example.message
//   };
// };

// export default connect(mapStateToProps)(SecondScreen);
export default SecondScreen
