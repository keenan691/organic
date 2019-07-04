import RNFS from 'react-native-fs'
import { SourceTypes } from "./store/types";

export const getDataSource = (type: SourceTypes) => ({
  "assets": (filepath: string) => RNFS.readFileAssets(filepath, 'utf8')
}[type])
