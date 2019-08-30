import {TextInput} from 'react-native-paper'
import {compose} from 'recompose'
import {
  handleTextInput,
  withNextInputAutoFocusInput,
} from 'react-native-formik';

const TextInputFormik = compose(
  handleTextInput,
  withNextInputAutoFocusInput,
)(TextInput)

export default TextInputFormik
