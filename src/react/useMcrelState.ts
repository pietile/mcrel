import { useState } from 'react';

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
  const [source, setSource] = useState<T>(state);

  function setState<P extends Subset<T, P, DeepMergeAtomics<never>>>(
    arg: P | ((value: DeepReadonlyObject<T>) => P),
  ): void {
    if (typeof arg === 'object') {
      setSource(deepMerge(source, arg));
    } else {
      setSource(deepMerge(source, arg(source as DeepReadonlyObject<T>)));
    }
  }

  return [source as DeepReadonlyObject<T>, setState];
}
