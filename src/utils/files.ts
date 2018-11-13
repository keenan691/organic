import R from 'ramda';

export const pathToFileName = R.pipe(R.split('/'), R.last);

export const getFileTitle = (file) =>
  file.path ? pathToFileName(file.path) : file.metadata.TITLE;

export function formatBytes(bytes, decimals) {
  if (bytes == 0) {
    return '0 Bytes';
  }
  var k = 1024,
    dm = decimals || 2,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
