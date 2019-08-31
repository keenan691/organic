import {Text, View} from 'react-native'
import {TextInput} from 'react-native-paper'
import {TouchableOpacity, ScrollView} from 'react-native-gesture-handler'
import {compose} from 'recompose'
import {handleTextInput, withNextInputAutoFocusInput} from 'react-native-formik'
import React, {useState, useCallback, forwardRef} from 'react'

import styles from './styles'

const filterCandidates = (candidates: string[], value: string) => {
  if (!value) return candidates
  return candidates.filter(
    candidate => candidate !== value && candidate.toLowerCase().startsWith(value.toLowerCase()),
  )
}

function AutocompleteTextInput(props, ref) {
  const {setFieldValue, setFieldTouched, value, candidates} = props
  const [dropdownVisibility, setDropdownVisibility] = useState(false)
  const showDropdownCallback = useCallback(() => setDropdownVisibility(true), [])
  const hideDropdownCallback = useCallback(() => setDropdownVisibility(false), [])
  const filteredCandidates = filterCandidates(candidates, value)
  return (
    <View>
      <TextInput
        ref={ref}
        {...props}
        onFocus={showDropdownCallback}
        onBlur={hideDropdownCallback}
      />
      {dropdownVisibility && filteredCandidates.length > 0 && (
        <ScrollView style={styles.dropdown} keyboardShouldPersistTaps="always">
          {filteredCandidates.map(item => (
            <TouchableOpacity
              onPress={() => {
                setFieldValue(item)
              }}>
              <Text style={styles.dropdownItem}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  )
}

const AutocompleteTextInputFormik = compose(
  handleTextInput,
  withNextInputAutoFocusInput,
  forwardRef,
)(AutocompleteTextInput)

export default AutocompleteTextInputFormik
