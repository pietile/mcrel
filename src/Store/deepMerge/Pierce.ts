// Unique pierce id
export const PierceID = Symbol('InsideID');

export interface Pierce<K, V> {
  id: typeof PierceID;
  key: K;
  value: V;
}

export function pierce<K, V>(key: K, value: V): Pierce<K, V> {
  return {
    id: PierceID,
    key,
    value,
  };
}
