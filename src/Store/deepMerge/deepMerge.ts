import { GuardFunction, GuardedTypes } from '../GuardedTypes';

import { deepMergeImpl } from './deepMergeImpl';
import { DeepMergeCircularError } from './errors';
import { Subset } from './Subset';

// ES6 built-in Atomic types
type AtomicObject =
  | Date
  | Function
  | Promise<any>
  | ReadonlyArray<any>
  | ReadonlyMap<any, any>
  | ReadonlySet<any>
  | RegExp
  | WeakMap<any, any>
  | WeakSet<any>;

// Helper type that combines built-in Atomics and Atomics from guard functions
export type DeepMergeAtomics<G extends GuardFunction[]> = AtomicObject | GuardedTypes<G>;

// Merge source with target into new object
export function deepMerge<
  T,
  S extends Subset<T, S, DeepMergeAtomics<G>>,
  G extends GuardFunction[] = never
>(target: T, source: S, atomicGuards?: G): T {
  try {
    return deepMergeImpl(target, source, function isAtomicObject(value: object): boolean {
      const knwonAtomic =
        Array.isArray(value) ||
        value instanceof Date ||
        value instanceof Map ||
        value instanceof Promise ||
        value instanceof RegExp ||
        value instanceof Set ||
        value instanceof WeakMap ||
        value instanceof WeakSet;

      return knwonAtomic || (!!atomicGuards && atomicGuards.some((guard): boolean => guard(value)));
    });
  } catch (error) {
    if (
      (error.message && error.message.match(/stack|recursion/i)) ||
      error.number === -2146828260
    ) {
      /**
       * Browsers give this different errors name and messages:
       * chrome/safari: "RangeError", "Maximum call stack size exceeded"
       * firefox: "InternalError", too much recursion"
       * edge: "Error", "Out of stack space"
       */

      throw new DeepMergeCircularError();
    }

    throw error;
  }
}
