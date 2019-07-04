import React, { useEffect } from 'react'
import { SafeAreaView, View, Text } from 'react-native'

import styles from './styles'
import { useSelector, useDispatch } from 'react-redux';
import { startupSelectors, startupActions } from 'core/startup';

function Splash() {
  const dispatch = useDispatch()
  const isReady = useSelector(startupSelectors.getIsReady)
  useEffect(() => {
    dispatch(startupActions.startup.request())
  }, [])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text>Tutaj powinien się wyświelić welcome screen ze spinnerem</Text>
        <Text>Także po wgraniu pominna się tutaj pojawić akceptacjia licemcji i manual</Text>
        <Text>Lecz generalnie powinien to być zwykły load screen.</Text>
      </View>
    </SafeAreaView>
  )
}

export default Splash
