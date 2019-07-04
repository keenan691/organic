import R from 'ramda'

const isObject = R.compose(
  R.equals('Object'),
  R.type
)
const allAreObjects = R.compose(
  R.all(isObject),
  R.values
)
const hasLeft = R.has('left')
const hasRight = R.has('right')
const hasBoth = R.both(hasLeft, hasRight)
const isEqual = R.both(
  hasBoth,
  R.compose(
    R.apply(R.equals),
    R.values
  )
)

const markAdded = R.compose(
  R.append(undefined),
  R.values
)
const markRemoved = R.compose(
  R.prepend(undefined),
  R.values
)
const isAddition = R.both(hasLeft, R.complement(hasRight))
const isRemoval = R.both(R.complement(hasLeft), hasRight)

function _diff(l, r) {
  return R.compose(
    R.map(
      R.cond([
        [isAddition, markAdded],
        [isRemoval, markRemoved],
        [
          hasBoth,
          R.ifElse(
            allAreObjects,
            R.compose(
              R.apply(objectDiff),
              R.values
            ),
            R.values
          ),
        ],
      ])
    ),
    R.reject(isEqual),
    R.useWith(R.mergeWith(R.merge), [R.map(R.objOf('left')), R.map(R.objOf('right'))])
  )(l, r)
}

export const objectDiff = R.curry(_diff)
