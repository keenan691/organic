import {
  getChangedNodes
} from './OrgApi';

import {
  OrgFileSchema
} from '../models';

import {
  orgStringToNodes
} from '../Transforms/OrgTransforms';

const RNFS = require('react-native-fs');
const OrgFile = Object.assign({}, OrgFileSchema.properties);
const getOrgFiles = () => [Object.assign(OrgFile, {
  type: 'agenda',
  path: '/storage/emulated/0/Download/Sync/Public/org/personal.org'
})];

const temp = [{
  path: '/storage/emulated/0/Download/Sync/Public/org/personal.org',
  lastSync: new Date(0)
}]

export function getFilesWithExternalChanges(orgFilesState=temp) {
  return Promise.all(orgFilesState.map(file => RNFS.exists(file.path)))
    .then(filesExists => {
      const existingFiles = orgFilesState.filter((v, i) => filesExists[i]);
      const deletedFiles = orgFilesState.filter((v, i) => !filesExists[i]);
      return { deletedFiles, existingFiles };
    })
    .then(({ existingFiles, deletedFiles }) => {
      return Promise.all(existingFiles.map(file => RNFS.stat(file.path)))
        .then(stats => {
          const changedFiles = existingFiles.filter((v, i) => v.lastSync <
                                                    stats[i].mtime);
          // Flat results
          return {
            changed: changedFiles.map(o => o.path),
            deleted: deletedFiles.map(o => o.path)
          };
        });
    });
}

function resolveConflicts(internalChanges, externalChanges) {

}
