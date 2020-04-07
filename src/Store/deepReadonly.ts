/**
 * Deep read only object
 * See https://github.com/microsoft/TypeScript/pull/21316
 */
export type DeepReadonlyObject<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? T[P] extends (...args: any[]) => any
      ? T[P]
      : DeepReadonly<T[P]>
    : T[P];
};

export interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}
export interface DeepReadonlyMap<K, V> extends ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>> {}
export interface DeepReadonlySet<V> extends ReadonlySet<DeepReadonly<V>> {}

export type DeepReadonly<T> = T extends ReadonlyArray<infer V>
  ? DeepReadonlyArray<V>
  : T extends ReadonlyMap<infer K, infer V>
  ? DeepReadonlyMap<K, V>
  : T extends ReadonlySet<infer V>
  ? DeepReadonlySet<V>
  : DeepReadonlyObject<T>;
