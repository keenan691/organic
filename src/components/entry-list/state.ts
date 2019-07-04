import { NumberDict, BooleanDict } from "./types";

const initialState = {
  mode: '',
  isFocused: false,
  data: {}, // TODO move from here becouse it is immutable here and thimg should be changed globally and I will only receive data
  jumpList: [] as  string[],
  contentVisibilityDict: {} as BooleanDict,
  entryVisibilityDict: {} as NumberDict,
}

export default initialState
