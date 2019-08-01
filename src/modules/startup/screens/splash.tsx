import React, { Component, useEffect }  from 'react'
import { View, Text, Button } from 'react-native'

import styles from './styles'
import { useSelector, useDispatch } from 'react-redux';
import { startupSelectors, startupActions } from 'modules/startup/index';
import { useStateMonitor } from 'helpers/hooks';
import { DocumentPicker } from 'react-native-document-picker';

function Splash() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(startupActions.startup.request())
  }, [])

  const isReady = useSelector(startupSelectors.getIsReady)
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text>
          {isReady ? 'sdfsdf' : 'df'}
        </Text>
        <Text>dfdddfffTutaj powinien się wyświelić welcome screen ze spinnerem</Text>
        <Text>Także po wgraniu pominna się tutaj pojawić akceptacjia licemcji i manual</Text>
        <Text>Lecz generalnie powinien to być zwykły load screen.</Text>
        <Button title="open" onPress={async () => {
          try {
            const res = await DocumentPicker.pick({
              type: [DocumentPicker.types.images],
            });
            console.log(
              res.uri,
              res.type, // mime type
              res.name,
              res.size
            );
          } catch (err) {
            if (DocumentPicker.isCancel(err)) {
              // User cancelled the picker, exit any dialogs or menus and move on
            } else {
              throw err;
            }
}
        }}/>
      </View>
    </View>
  )
}

class SplashWrapped extends Component {
  render(){
    return <Splash {...this.props }/>
  }
}

export default SplashWrapped
