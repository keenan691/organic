import { InitialState } from './types'

const getWebDavServers = (state: InitialState) => ['http://195.116.235.151:5000/Documents']
// prettier-ignore
const selectors = {
  getWebDavServers,
}

export default selectors
