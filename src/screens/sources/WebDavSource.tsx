import React, {useState, useCallback} from 'react';
import {Options} from 'react-native-navigation';
import {View, Text, StyleSheet} from 'react-native';
import {
  Button,
  TextInput,
  Caption,
  Headline,
  Divider,
} from 'react-native-paper';
import {inc} from 'ramda';
import {Formik} from 'formik';
import {
  handleTextInput,
  withNextInputAutoFocusInput,
  withNextInputAutoFocusForm,
} from 'react-native-formik';
import {compose} from 'recompose';
import * as Yup from 'yup';
import {FormFormik} from 'elements';
type Props = {
  componentId: string;
};
const states = {
  0: {disabled: true, children: 'connect'}, // button
  1: {disabled: false, children: 'connect'}, // button
  2: {loading: true, children: 'connecting'},
  3: {children: 'add source'},
};

const MyInput = compose(
  handleTextInput,
  withNextInputAutoFocusInput,
)(TextInput);

const {createClient} = require('webdav');
const client = createClient('http://195.116.235.151:5000/Documents/', {
  username: 'admin',
  password: 'koyote69.',
});

async function name() {
  try {
    const directoryItems = await client.getFileContents('/someday.org', {
      format: 'text',
    });
    const stat = await client.stat('/someday.org');
    console.tron.debug(stat);
  } catch (err) {
    console.tron.debug(err);
  }
}

name();

const validationSchema = Yup.object().shape({
  url: Yup.string()
    .required()
    .url("well that's not an email"),
  path: Yup.string().required(),
  username: Yup.string().required(),
  password: Yup.string().required(),
});

export default function WebDavSource({componentId}: Props) {
  const [stst, setStst] = useState(1);
  const submitCallback = useCallback(() => {}, []);
  return (
    <View style={styles.page}>
      <Formik
        onSubmit={values => {
          setStst(inc(1));
          console.tron.debug(values);
        }}
        validationSchema={validationSchema}
        render={props => (
          <FormFormik>
            <Headline>Server Settings</Headline>
            <MyInput
              autoFocus
              value="http://195.116.235.151:5000/Documents/"
              label="url"
              name="url"
              type="url"
            />
            <MyInput
              value="/someday.org"
              label="path"
              name="path"
              type="name"
            />
            <Headline>Creditials</Headline>
            <MyInput
              value="keenan"
              label="username"
              name="username"
              type="name"
            />
            <MyInput
              value="koyote69."
              label="password"
              name="password"
              type="password"
            />
            <Button
              onPress={props.handleSubmit}
              mode="contained"
              {...states[stst]}
            />
          </FormFormik>
        )}
      />
    </View>
  );
}

WebDavSource.options = (): Options => ({
  topBar: {
    title: {
      text: 'WebDavSource Screen',
    },
  },
});

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: 'white',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
});
