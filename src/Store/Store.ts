import { DeepMergeAtomics, Subset, deepMerge } from './deepMerge';
import { DeepReadonlyObject } from './deepReadonly';
import { GuardFunction } from './GuardedTypes';

export type Subscription<T> = (state: DeepReadonlyObject<T>) => void;

export type Unsubscribe = () => void;

// Readonlt stoore interface. Omits Atomics information.
export interface ReadonlyStore<T> {
  getState(): DeepReadonlyObject<T>;

  subscribe(callback: (state: DeepReadonlyObject<T>) => void): Unsubscribe;
}

export class Store<T, G extends GuardFunction[] = never> implements ReadonlyStore<T> {
  private subscriptions: Subscription<T>[] = [];

  constructor(private state: T, private atomicGuards?: G) {}

  getState(): DeepReadonlyObject<T> {
    // https://github.com/microsoft/TypeScript/issues/32198
    return this.state as DeepReadonlyObject<T>;
  }

  setState<P extends Subset<T, P, DeepMergeAtomics<G>>>(
    arg: P | ((state: DeepReadonlyObject<T>) => P),
  ): DeepReadonlyObject<T> {
    if (typeof arg === 'object') {
      this.state = deepMerge(this.state, arg, this.atomicGuards);
    } else {
      this.state = deepMerge(this.state, arg(this.getState()), this.atomicGuards);
    }

    this.subscriptions.forEach((subscription): void => subscription(this.getState()));

    return this.getState();
  }

  subscribe(callback: (state: DeepReadonlyObject<T>) => void): Unsubscribe {
    this.subscriptions.push(callback);

    return (): void => {
      const index = this.subscriptions.findIndex(
        (subscription): boolean => subscription === callback,
      );
      if (index === -1) {
        return;
      }

      this.subscriptions.splice(index, 1);
    };
  }
}

export function createStore<T>(t: T): <G extends GuardFunction[]>(atomicGuards: G) => Store<T, G> {
  return <G extends GuardFunction[]>(atomicGuards: G): Store<T, G> => {
    return new Store<T, G>(t, atomicGuards);
  };
}
