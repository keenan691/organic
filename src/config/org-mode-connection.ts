import { OrgApi } from 'org-mode-connection'
import RNFS from 'react-native-fs'
import Realm from 'realm'

OrgApi.configureFileAccess(RNFS)
OrgApi.configureDb(Realm)
OrgApi.connectDb()

export default OrgApi
