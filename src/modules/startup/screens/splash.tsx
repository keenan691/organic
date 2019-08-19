import React, { Component, useEffect } from 'react'
import { View, Text, Button, Linking, PermissionsAndroid } from 'react-native'
import { Paragraph } from 'react-native-paper';

import styles from './styles'
import { useSelector, useDispatch } from 'react-redux'
import { startupSelectors, startupActions } from 'modules/startup/index'
import { useStateMonitor } from 'helpers/hooks'
import DocumentPicker from 'react-native-document-picker'
import RNFS from 'react-native-fs'
import RNFetchBlob from 'rn-fetch-blob'

async function requestCameraPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Cool Photo App Camera Permission',
        message:
          'Cool Photo App needs access to your camera ' + 'so you can take awesome pictures.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera')
    } else {
      console.log('Camera permission denied')
    }
  } catch (err) {
    console.warn(err)
  }
}
async function requestCameraPermission2() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Cool Photo App Camera Permission',
        message:
          'Cool Photo App needs access to your camera ' + 'so you can take awesome pictures.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can write to external')
    } else {
      console.log('Camera permission denied')
    }
  } catch (err) {
    console.warn(err)
  }
}

const CONTENT_PREFIXES = {
  RESILLIO_SYNC: 'content://com.resilio.sync.documents/document//',
}

const openPicker = async () => {
  console.tron.debug(DocumentPicker.types)
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
    console.tron.debug('URI')
    console.tron.debug(res)
    const name = decodeURIComponent(res.uri)

    if (name.startsWith(CONTENT_PREFIXES.RESILLIO_SYNC)) {
      const realPath = name.replace(CONTENT_PREFIXES.RESILLIO_SYNC, '')
      const content = await RNFetchBlob.fs.readFile(realPath, 'utf8')
      const stat = await RNFetchBlob.fs.stat(realPath, 'utf8')
      console.tron.debug(stat)
      console.tron.debug(content)
      await RNFetchBlob.fs.writeFile(realPath, content + '1')
    }
    return
  } catch (err) {}
}

function Splash() {
  const dispatch = useDispatch()

  useEffect(() => {
    requestCameraPermission()
    requestCameraPermission2()
    dispatch(startupActions.startup.request())

    const handleOpenURL = url => {
      console.tron.debug('handle url')
      console.tron.debug(url)
      /* console.tron.debug(decodeURIComponent(url.url)) */
      RNFS.readFile(url.url)
        .then(data => {
          console.tron.debug('file is red')
        })
        .catch(error => {
          console.tron.debug('error')
          console.tron.debug(error)
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
