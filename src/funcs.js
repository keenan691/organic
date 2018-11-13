import R from "ramda";

import { pathToFileName } from './utils/files';

const findNextNodeSameLevel = (nodeId, data) =>
      R.pipe(
        R.dropWhile(R.complement(R.equals(nodeId))),
        R.drop(1),
        R.find(id => data[id].level === data[nodeId].level)
      );

const findPrevNodeSameLevel = (nodeId, data) =>
      R.pipe(R.reverse, findNextNodeSameLevel(nodeId, data));

export const getFileTitle = props =>
      R.pathOr(
        props.path && pathToFileName(props.path),
        ["metadata", "TITLE"],
        props
      );

export const safeGetId = R.propOr(undefined, 'id')

export const range = (start, length) => Array.from({ length }, (x, i) => start + i);
