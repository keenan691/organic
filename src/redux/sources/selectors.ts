import { InitialState } from './types'

const getWebDavServers = (state: InitialState) => ['http://195.116.235.151:5000/Documents']
const getStatus = (state: InitialState) => state.status
const getData = (state: InitialState) => state.data
// prettier-ignore
const selectors = {
  getWebDavServers,
  getStatus,
  getData,
}

export default selectors
