import R from 'ramda';

import { pathToFileName } from './utils/files';

export const getFileTitle = (props) =>
  R.pathOr(
    props.path && pathToFileName(props.path),
    ['metadata', 'TITLE'],
    props,
  );

export const safeGetId = R.propOr(undefined, 'id');
