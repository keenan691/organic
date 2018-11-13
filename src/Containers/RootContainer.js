import { StatusBar, Text, View } from 'react-native';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import R from 'ramda';
import React, { Component } from 'react'

import { OrgDataSelectors } from '../redux/OrgDataRedux';
import AppNavigation, { RootStack } from '../Navigation/AppNavigation';
import BusyScreen from '../Components/BusyScreen';
import ReduxNavigation from '../Navigation/ReduxNavigation';
import ReduxPersist from '../Config/ReduxPersist'
import StartupActions from '../redux/StartupRedux'
import styles from './Styles/RootContainerStyles'


class RootContainer extends Component {
  static propTypes = {
    isBusy: PropTypes.bool.isRequired,
  }

  componentDidMount () {
    // if redux persist is not active fire startup action
    if (!ReduxPersist.active) {
      this.props.startup()
    }
  }

  render () {
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle='light-content' />
        <AppNavigation />
      </View>
    )
  }
}



// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = (dispatch) => ({
  startup: () => dispatch(StartupActions.startup())
})

const mapStateToProps = R.applySpec({
  isBusy: OrgDataSelectors.syncing
})

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer)
