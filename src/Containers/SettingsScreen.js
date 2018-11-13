import { Image, ScrollView, Text, View } from 'react-native';
import React, { Component } from 'react'

import { Images } from '../Themes'
import styles from './Styles/SettingsScreenStyles'

// * Intro
// This picker allows use of extensions:

// org-mode-connection functionalities:
// - [ ] OrgFilesList
//   - [ ] remove
// - [ ] AddOrgFileButton
// - [ ] RecreateDatabase

// redux forms fields
// - [ ] Look&Feel
//   - [ ] Font size
//   - [ ] Theme
// - [ ] OrgMode conf
//   - [ ] Tags excluded from inheritance
//   - [ ] Insert  note creation time
//   - [ ] TodoStates - shows modal with two fields but in main form it is displayed TODO NEXT | DONE
//     - [ ] todos
//     - [ ] done

// * Settings component

export default class SettingsScreen extends Component {
  // // Prop type warnings
  // static propTypes = {
  //   someProperty: PropTypes.object,
  //   someSetting: PropTypes.bool.isRequired,
  // }
  //
  // // Defaults for props
  // static defaultProps = {
  //   someSetting: false
  // }

  render () {
    return (
      <View style={styles.mainContainer}>
        <ScrollView style={styles.container}>
          <View style={styles.section} >
          </View>
        </ScrollView>
      </View>
    )
  }
}
