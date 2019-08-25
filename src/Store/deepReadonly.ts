// Deep readonlyy object
// See https://github.com/microsoft/TypeScript/pull/21316s
export type DeepReadonlyObject<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? T[P] extends (...args: any[]) => any
      ? T[P]
      : DeepReadonly<T[P]>
    : T[P];
};

interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}
interface DeepReadonlyMap<K, V> extends ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>> {}
interface DeepReadonlySet<V> extends ReadonlySet<DeepReadonly<V>> {}

type DeepReadonly<T> = T extends ReadonlyArray<infer V>
  ? DeepReadonlyArray<V>
  : T extends ReadonlyMap<infer K, infer V>
  ? DeepReadonlyMap<K, V>
  : T extends ReadonlySet<infer V>
  ? DeepReadonlySet<V>
  : DeepReadonlyObject<T>;
