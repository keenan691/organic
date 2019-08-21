import { OrgApi } from 'org-mode-connection'
import Realm from 'realm'
import RNFetchBlob from 'rn-fetch-blob';

OrgApi.configureFileAccess(RNFetchBlob)
OrgApi.configureDb(Realm)
OrgApi.connectDb()

export default OrgApi
