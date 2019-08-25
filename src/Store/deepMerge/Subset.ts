import { Pierce } from './Pierce';

// Supported pierceable types
type Pierceable = ReadonlyArray<any> | ReadonlyMap<any, any>;

// Pierced object key type
type KeyType<T> = T extends Array<any> ? number : T extends Map<infer K, any> ? K : never;

// Pierced object value type
type ValueType<T> = T extends Array<infer R> ? R : T extends Map<any, infer V> ? V : never;

// Subset or Atomic
type SubsetObject<T, S, A> = T extends A ? Pick<T, keyof T> : Subset<T, S, A>;

// Check if S is a pierce
type SubsetPierceOrObject<T, S, A> = T extends Pierceable
  ? S extends Pierce<any, infer V>
    ? Pierce<KeyType<T>, Subset<ValueType<T>, V, A>>
    : SubsetObject<T, S, A>
  : SubsetObject<T, S, A>;

// Ensure S is a suptype of T with Atomics A
export type Subset<T, S, A> = {
  [K in keyof S]: K extends keyof T
    ? NonNullable<T[K]> extends object
      ? S[K] extends object // Go deep only if T[K] and S[K] are objects
        ? SubsetPierceOrObject<NonNullable<T[K]>, S[K], A>
        : T[K]
      : T[K]
    : never;
};
