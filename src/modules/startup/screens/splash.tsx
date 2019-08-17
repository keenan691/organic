import React, { Component, useEffect } from 'react'
import { View, Text, Button, Linking } from 'react-native'

import styles from './styles'
import { useSelector, useDispatch } from 'react-redux'
import { startupSelectors, startupActions } from 'modules/startup/index'
import { useStateMonitor } from 'helpers/hooks'
import DocumentPicker from 'react-native-document-picker'
import RNFS from 'react-native-fs'

function Splash() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(startupActions.startup.request())
    const handleOpenURL = url => {
      console.tron.debug('handle url')
      console.tron.debug(url)
      RNFS.readFile(url.url).then(data => {
        console.tron.debug('file is red')
      })
    }
    /* console.tron.debug('HUJ')
     * Linking.getInitialURL().then(url => {
     *   console.tron.debug('initialurl')
     *   console.tron.debug(url)
     * }) */
    Linking.addEventListener('url', handleOpenURL)
    return () => Linking.removeEventListener('url', handleOpenURL)
  }, [])

  const isReady = useSelector(startupSelectors.getIsReady)

  const openPicker = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      })
      console.log(
        res.uri,
        res.type, // mime type
        res.name,
        res.size
      )
      console.tron.debug(res.uri)
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err
      }
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text>{isReady ? 'sdfsdf' : 'df'}</Text>
        <Text>dfdddfffdfTutaj powinien się wyświelić welcome screen ze spinnerem</Text>
        <Text>Także po wgraniu pominna się tutaj pojawić akceptacjia licemcji i manual</Text>
        <Text>Lecz generalnie powinien to być zwykły load screen.</Text>
        <Button title="open" onPress={openPicker} />
      </View>
    </View>
  )
}

class SplashWrapped extends Component {
  render() {
    return <Splash {...this.props} />
  }
}

export default SplashWrapped
