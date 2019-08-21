import RNFetchBlob from "rn-fetch-blob";

export type AssetsFileSource = {
  sourceType: 'assets'
  path: string
}

export type SourceTypes = AssetsFileSource['sourceType']

export const getDataSource = (type: SourceTypes) => ({
  "assets": (filepath: string) => RNFetchBlob.fs.asset(filepath)
}[type])
