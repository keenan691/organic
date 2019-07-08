import { NumberDict, BooleanDict } from "./types";

const initialState = {
  mode: '',
  isFocused: false,
  ordering: [] as string[],
  levels: {} as NumberDict,
  itemsDict: {}, // TODO move from here becouse it is immutable here and thimg should be changed globally and I will only receive data
  jumpList: [] as  string[],
  contentVisibilityDict: {} as BooleanDict,
}

export default initialState
