import { useReducer, useCallback, Reducer } from 'react';
import { logAction } from 'helpers/debug';
import { Action } from './types';

export function useMyReducer<R extends Reducer<S,F>, S, F>(red:R , initS: S, init: F): [S, (action: Action) => void] {
    // TODO save last dispatched action of type interactive
    // TODO create custom action type with diaplay name
    // TODO toggle monitoring
  const [state, dispatch] = useReducer(red, initS, init);

    const wrappedDispatch = useCallback(action => {
        const updatedAction = {
            ...action,
            meta: { dispatch: wrappedDispatch },
        };
        __DEV__ &&
            logAction(updatedAction);
        return dispatch(updatedAction);
    }, []);

    return [state, wrappedDispatch];
}
