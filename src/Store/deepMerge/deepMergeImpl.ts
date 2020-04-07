import { PierceWrongKeyError, PierceWrongTargetError } from './errors';
import { Pierce, PierceID } from './Pierce';

export type IsAtomicObject = (value: object) => boolean;

// DeepMerge implementation using runtime information only
export function deepMergeImpl(target: any, source: any, isAtomicObject: IsAtomicObject): any {
  if (typeof target !== 'object') {
    throw new Error(`merge target must be an object, but got: ${target}`);
  }

  if (typeof source !== 'object') {
    throw new Error(`merge source must be an object, but got: ${source}`);
  }

  const result = { ...target };

  Object.entries<any>(source).forEach(([key, value]): void => {
    if (typeof result[key] === 'object' && result[key] !== null && !!value) {
      if (typeof value === 'object' && value.id === PierceID) {
        result[key] = pierceMerge(target[key], value, isAtomicObject);

        return;
      }

      if (!isAtomicObject(result[key])) {
        result[key] = deepMergeImpl(target[key], value, isAtomicObject);

        return;
      }
    }

    result[key] = value;
  });

  return result;
}

// Piercing
function pierceMerge(target: any, pierce: Pierce<any, any>, isAtomicObject: IsAtomicObject): any {
  if (Array.isArray(target)) {
    const result = Array.from(target);

    if (result[pierce.key] === undefined) {
      throw new PierceWrongKeyError(pierce.key);
    }

    const { value } = deepMergeImpl(
      { value: result[pierce.key] },
      { value: pierce.value },
      isAtomicObject,
    );

    result[pierce.key] = value;

    return result;
  }

  if (target instanceof Map) {
    const result = new Map(target);

    if (!result.has(pierce.key)) {
      throw new PierceWrongKeyError(pierce.key);
    }

    const { value } = deepMergeImpl(
      { value: result.get(pierce.key) },
      { value: pierce.value },
      isAtomicObject,
    );

    result.set(pierce.key, value);

    return result;
  }

  throw new PierceWrongTargetError(target);
}
