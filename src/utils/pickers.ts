import R from 'ramda';
import { DatePickerAndroid, TimePickerAndroid } from 'react-native';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import RNGRP from 'react-native-get-real-path';
import Picker from 'react-native-picker';
import { NavigationActions } from '../navigation';

export const showRepeaterDialog = (selectedValue, setHandler) => {
  const pickerData = [
    ['+', '++', '.+'],
    R.range(1, 100),
    ['h', 'd', 'w', 'm', 'y'],
  ];
  Picker.init({
    pickerData,
    pickerConfirmBtnText: 'Confirm',
    pickerCancelBtnText: 'Cancel',
    pickerTitleText: 'Repeater',
    pickerToolBarFontSize: 18,
    pickerFontSize: 18,
    pickerConfirmBtnColor: [205, 92, 92, 1],
    pickerCancelBtnColor: [205, 92, 92, 1],
    selectedValue,
    onPickerConfirm: (data) => {
      setHandler(data);
    },
    onPickerCancel: (data) => {
      console.log(data);
    },
    onPickerSelect: (data) => {
      console.log(data);
    },
  });
  Picker.show();
};

export const showTimePicker = async (selectedValue, setHandler) => {
  const date = new Date(selectedValue);
  try {
    const { action, hour, minute } = await TimePickerAndroid.open({
      hour: date.getHours(),
      minute: date.getMinutes(),
    });
    if (action !== TimePickerAndroid.dismissedAction) {
      // Selected hour (0-23), minute (0-59)
      date.setMinutes(minute);
      date.setHours(hour);
      setHandler(date);
    }
  } catch ({ code, message }) {
    console.warn('Cannot open time picker', message);
  }
};

export const showDatePickerDialog = async (selectedValue, setHandler) => {
  const date = new Date(selectedValue);
  try {
    const { action, year, month, day } = await DatePickerAndroid.open({
      date: selectedValue,
    });
    if (action !== DatePickerAndroid.dismissedAction) {
      date.setYear(year);
      date.setMonth(month);
      date.setDate(day);
      setHandler(date);
    }
  } catch ({ code, message }) {
    console.warn('Cannot open date picker', message);
  }
};

const validateFile = ({ type, fileName }) =>
  type === 'application/octet-stream' && /.org$/.test(fileName);

// * Document picker

// - [ ] check if type is 'application/octet-stream'
// - [ ] check fileName ends on org suffix

export const openDocumentPicker = (successHandler) => () =>
  DocumentPicker.show(
    { filetype: [DocumentPickerUtil.allFiles()] },
    (error, res) => {
      if (res) {
        RNGRP.getRealPathFromURI(res.uri).then((path) => {
          const isCorrectFile =
            !error && validateFile(res) ? successHandler(path) : null;
          if (!isCorrectFile) {
            NavigationActions.showSnackbar(
              "Chosen file is not 'org mode' type",
            );
            return null;
          }
          return true;
        });
      }
    },
  );
