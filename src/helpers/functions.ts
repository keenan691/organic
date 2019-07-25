import { propOr } from "ramda";

export const safeGet = propOr(null)

export const itemKeyExtractor = item => item.id
