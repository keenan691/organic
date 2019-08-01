import { NumberDict } from "components/editor/types";

export type ItemHeightCache = NumberDict

export type ItemData = {
  levels: number[],
  ordering: string[],
  hideDict: {[id: string]: boolean} | {},
}
