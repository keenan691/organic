import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import R from 'ramda';
import React from 'react';

import { OrgDataSelectors } from '../redux/OrgDataRedux';
import OrgFileVisitor from './OrgFileVisitor';
import OrgFilesList from './OrgFilesList';

// * OrgBrowser

const OrgBrowser = ({ isVisitingFile }) => {
  let renderer
  if (isVisitingFile) {
    renderer = (<OrgFileVisitor />)
  } else {
    renderer = (<OrgFilesList />)
  }
  return renderer
}

OrgBrowser.propTypes = {
  isVisitingFile: PropTypes.bool,
}

const mapStateToProps = R.applySpec({
  isVisitingFile: OrgDataSelectors.isVisitingFile,
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(OrgBrowser)
