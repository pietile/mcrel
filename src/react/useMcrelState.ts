import { useCallback, useReducer, useRef } from 'react';

import { DeepReadonlyObject } from '../Store';
import { DeepMergeAtomics, Subset, deepMerge } from '../Store/deepMerge';

export function useMcrelState<T>(
  state: T,
): [
  DeepReadonlyObject<T>,
  <P extends Subset<T, P, DeepMergeAtomics<never>>>(
    arg: P | ((state: DeepReadonlyObject<T>) => P),
  ) => void,
] {
  const source = useRef<T>(state);
  const [, forceUpdate] = useReducer((x): number => x + 1, 0);

  const setState = useCallback(
    <P extends Subset<T, P, DeepMergeAtomics<never>>>(
      arg: P | ((value: DeepReadonlyObject<T>) => P),
    ): void => {
      if (typeof arg === 'object') {
        source.current = deepMerge(source.current, arg);
      } else {
        source.current = deepMerge(source.current, arg(source.current as DeepReadonlyObject<T>));
      }

      forceUpdate({});
    },
    [],
  );

  return [source.current as DeepReadonlyObject<T>, setState];
}
