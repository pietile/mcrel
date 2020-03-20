import { useContext, useEffect, useReducer, useState } from 'react';

import { DeepReadonlyObject, ReadonlyStore } from '../Store';

import { Context } from './Context';

export type Selector<S, R> = (state: DeepReadonlyObject<S>) => R;

export type CompareFunction<T> = (a: T, b: T) => boolean;

interface State<S, R> {
  selector: Selector<S, R>;
  compareFunction: CompareFunction<R>;
  store: ReadonlyStore<S>;
  selected: R;
}

export function compareByValue<T>(a: T, b: T): boolean {
  return a === b;
}

export function useMcrelSelector<S, R>(
  selector: Selector<S, R>,
  compareFunction: CompareFunction<R> = compareByValue,
): R {
  const store = useContext<ReadonlyStore<S>>(Context as any); // @@

  const [, forceUpdate] = useReducer((x): number => x + 1, 0);

  const [state] = useState<State<S, R>>(
    (): State<S, R> => ({
      selector,
      compareFunction,
      store,
      selected: selector(store.getState()),
    }),
  );

  let needReselect = false;

  if (state.selector !== selector) {
    state.selector = selector;
    needReselect = true;
  }

  if (state.store !== store) {
    state.store = store;
    needReselect = true;
  }

  if (state.compareFunction !== compareFunction) {
    state.compareFunction = compareFunction;
    needReselect = true;
  }

  useEffect((): (() => void) => {
    return store.subscribe((): void => {
      const selected = state.selector(store.getState());

      if (state.compareFunction(state.selected, selected)) {
        return;
      }

      state.selected = selected;
      forceUpdate();
    });
  }, [store, state]);

  if (needReselect) {
    const selected = selector(store.getState());

    if (!state.compareFunction(state.selected, selected)) {
      state.selected = selected;
    }
  }

  return state.selected;
}
