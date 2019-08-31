import {Button} from 'react-native-paper'
import {Formik} from 'formik'
import {Options, Navigation} from 'react-native-navigation'
import {Source, Stat} from 'redux/sources/types'
import {View, StyleSheet, Keyboard} from 'react-native'
import {createClient} from 'webdav'
import {prop} from 'ramda'
import React, {useState, useEffect, useCallback} from 'react'
import * as Yup from 'yup'

import {FormFormik, TextInputFormik, GroupFormik, AutocompleteTextInputFormik} from 'elements'
import { useSelector, useDispatch } from 'react-redux';
import { sourcesSelectors, sourcesActions } from 'redux/sources';

type Props = {
  componentId: string
}

const createSourceClient = ({type, password, url, username}: Source) => {
  let client
  switch (type) {
    case 'webdav':
      client = createClient(url, {
        username,
        password,
      })
      break
  }
  return client
}

const validationSchema = Yup.object().shape({
  url: Yup.string()
    .required()
    .url(),
  path: Yup.string().required(),
  username: Yup.string().required(),
  password: Yup.string().required(),
})

const createSourceFromFormValues = values => ({
  ...values,
  type: 'webdav',
})


export type PingSourceResult = {
  status: boolean
  error?: string
  stat?: Stat
  content?: string
}

const pingSource = async (source: Source): Promise<PingSourceResult> => {
  const client = createSourceClient(source)
  let result
  try {
    const stat: Stat = await client.stat('/someday.org')
    let content: string
    if (stat.type === 'file') {
      // fetch file content
      content = await client.getFileContents('/someday.org', {format: 'text'})
      // check if have write rights
      await client.putFileContents('/someday.org', content)
    } else {
      content = ''
    }
    result = {
      status: true,
      stat,
      content,
    }
  } catch (err) {
    console.tron.error(err)
    result = {status: false}
  }
  return result
}

const tryToFetchFileCandidates = async (source: Source): string[] => {
  try {
    const client = createSourceClient(source)
    const result = await client.getDirectoryContents('/', {glob: '/**/*.org'})
    return result.map(prop('basename'))
  } catch (err) {
    return []
  }
}

export default function WebDavSource({componentId}: Props) {
  const [source, setSource] = useState<null | Source>(null)
  const [pingResult, setPingResult] = useState<null | PingSourceResult>(null)
  const [connecting, setConnecting] = useState(false)
  const [serverFiles, setServerFiles] = useState<string[]>([])

  const urlCandidates = useSelector(sourcesSelectors.getWebDavServers)
  const dispatch = useDispatch()

  useEffect(() => {
    if (source) {
      pingSource(source)
        .then(setPingResult)
        .finally(() => setConnecting(false))
    }
  }, [source])

  const handleAddSource = useCallback(() => {
    if (!pingResult) return
    const {content, stat} = pingResult
    dispatch(sourcesActions.addSource.request({
      source,
      stat,
      content
    }))
    Keyboard.dismiss()
    Navigation.dismissAllModals()
  }, [pingResult])

  const pingUrlCallback = useCallback(async values => {
    const source = createSourceFromFormValues(values)
    const candidates = await tryToFetchFileCandidates(source)
    setServerFiles(candidates)
  }, [])

  return (
    <View style={styles.page}>
      <Formik
        onSubmit={async values => {
          setConnecting(true)
          setSource(createSourceFromFormValues(values))
          setPingResult(null)
        }}
        initialValues={{
          username: 'admin',
          password: 'koyote69.',
        }}
        validationSchema={validationSchema}
        render={({handleSubmit, values}) => (
          <FormFormik>
            <GroupFormik title="Server Settings">
              <AutocompleteTextInputFormik
                autoFocus
                label="url"
                name="url"
                type="url"
                onSubmitEditing={() => pingUrlCallback(values)}
                candidates={urlCandidates}
              />
              <AutocompleteTextInputFormik
                label="path"
                name="path"
                type="name"
                candidates={serverFiles}
              />
            </GroupFormik>
            <GroupFormik title="Creditials">
              <TextInputFormik label="username" name="username" type="name" />
              <TextInputFormik label="password" name="password" type="password" />
            </GroupFormik>
            {pingResult && pingResult.stat && pingResult.stat.type === 'file' ? (
              <Button onPress={handleAddSource} mode="contained">
                Add {pingResult.stat.basename}({pingResult.stat.size})
              </Button>
            ) : (
              <Button onPress={handleSubmit} mode="contained" loading={connecting}>
                {connecting ? 'connecting' : 'connect'}
              </Button>
            )}
          </FormFormik>
        )}
      />
    </View>
  )
}

WebDavSource.options = (): Options => ({
  topBar: {
    title: {
      text: 'WebDavSource Screen',
    },
  },
})

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: 'white',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
})
