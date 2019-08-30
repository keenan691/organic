import {Button, TextInput, Headline} from 'react-native-paper'
import {Formik} from 'formik'
import {Options} from 'react-native-navigation'
import {View, StyleSheet} from 'react-native'
import {compose} from 'recompose'
import {handleTextInput, withNextInputAutoFocusInput} from 'react-native-formik'
import {inc, pipe, ifElse} from 'ramda'
import React, {useState, useCallback} from 'react'
import * as Yup from 'yup'

import {FormFormik, TextInputFormik, GroupFormik} from 'elements'

type Props = {
  componentId: string
}

const {createClient} = require('webdav')

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

/* value="http://195.116.235.151:5000/Documents/" */

/* <TextInputFormik value="keenan" label="username" name="username" type="name" />
 * <TextInputFormik value="koyote69." label="password" name="password" type="password" />
 *
 * <TextInputFormik value="/someday.org" label="path" name="path" type="name" /> */

export type Source = {
  type: 'webdav' | 'resillio-sync' | 'local-file'
  url: string
  path: string
  username: string
  password: string
}

const createSourceFromFormValues = values => ({
  ...values,
  type: 'webdav'
})

export type Stat = {
  filename:  string
  basename:  string
  lastmod: string // "Sun, 13 Mar 2016 04:23:32 GMT",
  size: number
  type: 'file' | 'directory'
  mime:  string
  etag:  string//"33a728c7f288ede1fecc90ac6a10e062"
}

export type PingSourceResult = Promise<{
  status: boolean
  error?:  string
  stat?: Stat
  content?: string
}>

const pingSource = async (source: Source): PingSourceResult => {
  const client = createSourceClient(source)
  let result
  try {
    const stat: Stat = await client.stat('/someday.org')
    let content: string
    if (stat.type === 'file'){
      // fetch file content
      content = await client.getFileContents('/someday.org', { format: 'text'})
      // check if have write rights
      await client.putFileContents("/someday.org", content);
    } else {
      content = ''
    }
    result = {
      status: true,
      stat,
      content
    }
  } catch (err) {
    console.tron.error(err)
    result = { status: false }
  }
  return new Promise(result)
}

export default function WebDavSource({componentId}: Props) {
  const [buttonState, setButtonState] = useState(1)
  const nextStage = () => setButtonState(inc(1))

  return (
    <View style={styles.page}>
      <Formik
        onSubmit={async values => {
          nextStage()
          const newSource = createSourceFromFormValues(values)
          console.tron.debug('D!')
          const pingResults = await pingSource(newSource)
          console.tron.debug('D4')
          console.tron.debug(pingResults)
        }}
        initialValues={{
          url: 'http://195.116.235.151:5000/Documents/',
          path: '/someday.org',
          username: 'admin',
          password: 'koyote69.',
        }}
        validationSchema={validationSchema}
        render={({handleSubmit}) => (
          <FormFormik>
            <GroupFormik title="Server Settings">
              <TextInputFormik autoFocus label="url" name="url" type="url" />
              <TextInputFormik label="path" name="path" type="name" />
            </GroupFormik>
            <GroupFormik title="Creditials">
              <TextInputFormik label="username" name="username" type="name" />
              <TextInputFormik label="password" name="password" type="password" />
            </GroupFormik>
            <Button
              onPress={handleSubmit}
              mode="contained"
              {...[
                {disabled: true, children: 'connect'},
                {disabled: false, children: 'connect'},
                {loading: true, children: 'connecting'},
                {children: 'add source'},
              ][buttonState]}
            />
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
