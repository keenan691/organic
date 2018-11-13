import R from 'ramda';

export const globalizeSelectors = (sliceName: string) => <T>(sel: T): T =>
  R.map((fun) => (state: GlobalState) => fun(state[sliceName]))(sel);

export const globalizeParametrizedSelectors = (sliceName: string) => <T>(
  sel: T,
): T =>
  R.map((fun) => (...parameters) => (state: GlobalState) =>
    fun(...parameters)(state[sliceName]),
  )(sel);
