import { Button } from 'react-native';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import R from 'ramda';
import React from 'react';
import styles from './Styles/OrgFilesListStyles'
import {
  DocumentPicker,
  DocumentPickerUtil,
} from 'react-native-document-picker';
import RNGRP from 'react-native-get-real-path';
import { FlatList, Slider, Image, SectionList, Text, TouchableOpacity, View } from 'react-native';
import OrgDataRedux, {
  OrgDataSelectors,
} from '../redux/OrgDataRedux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { asOrgDate } from 'org-mode-connection';
import { formatBytes, pathToFileName } from '../Transforms/FilesTransforms';
import IconBar from '../Components/IconBar';
import OrgContent from '../Components/OrgContent';
import OrgNode from '../Components/OrgNode';

// * OrgFilesList

// ** Document picker

const isChoiceValid = (res) => true;
const showOrgFileChooserDialog = (successHandler) => () => DocumentPicker.show(
  { filetype: [DocumentPickerUtil.allFiles()] },
  (error, res) => {
    RNGRP.getRealPathFromURI(res.uri).then(
      path => (!error && isChoiceValid(path)) ? successHandler(path) : null)
  }
)

// ** OrgFile

const OrgFile = ({ file, openFile, navigation }) => {
  const handleFileAction = () => navigation.navigate('FileVisitor', { fileId: file.id })
  const fileName = pathToFileName(file.path);
  const fileSize = formatBytes(file.size);
  const mtime = asOrgDate(file.mtime, false);
  return (
    <TouchableOpacity style={styles.orgFileContainer} onPress={handleFileAction} >
      <Text style={styles.fileNameTitleText}>{fileName}</Text>
      <Text style={styles.statusText}>
        <Icon name='info-circle' />{" "}
        {fileSize}</Text>
      <Text style={styles.statusText}>
        <Icon name='clock-o' />{" "}
        {mtime}</Text>
    </TouchableOpacity>
  )
}

OrgFile.propTypes = {
  file: PropTypes.object.isRequired,
  openFile: PropTypes.func.isRequired,
}

// ** Main

const OrgFilesList = ({ files = [], clearDb, sync, addFile, ...props }) => {
  const filesActions = [
    { iconName: 'plus', actionHandler: showOrgFileChooserDialog(addFile) },
    { iconName: 'refresh', actionHandler: sync },
    { iconName: 'navicon', actionHandler: clearDb },
  ];
  console.log('renders file list')
  return (
    <SectionList
      renderItem={({ item }) => <OrgFile file={item} {...props} />}
      renderSectionHeader={({ section: { title } }) => <IconBar items={filesActions} />}
      sections={[
        { title: 'Org files', data: files },
      ]}
      keyExtractor={(item) => item.id}
      />
  )
}

const Huj = (props) => {
  return (
    <View>
      <Text>files lsit renderes</Text>
      <Button title="sssf" onPress={() => props.navigation.push('FileVisitor')}/>
    </View>) }

OrgFilesList.propTypes = {
  // files: PropTypes.array.isRequired,
  // openFile: PropTypes.func.isRequired,
  // addFile: PropTypes.func.isRequired,
  // clearDb: PropTypes.func.isRequired,
  // sync: PropTypes.func.isRequired,
}
const mapStateToProps = R.applySpec({
  // files: OrgDataSelectors.getFiles,
})

const mapDispatchToProps = {
  // addFile: OrgDataRedux.addOrgFileRequest,
  // openFile: OrgDataRedux.openFileRequest,
  // removeFile: OrgDataRedux.removeOrgFileRequest,
  // clearDb: OrgDataRedux.clearDbRequest,
  // sync: OrgDataRedux.syncAllFilesRequest,
}

export default connect(mapStateToProps, mapDispatchToProps)(Huj)
