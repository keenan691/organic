import { NumberDict } from "components/entry-list/types";

export type ItemHeightCache = NumberDict

export type ItemData = {
  levels: number[],
  ordering: string[],
  hideDict: {[id: string]: boolean} | {},
}
