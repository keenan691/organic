import {View} from 'react-native'
import {withNextInputAutoFocusForm} from 'react-native-formik'

const FormFormik = withNextInputAutoFocusForm(View, {submitAfterLastInput: true})
export default FormFormik
