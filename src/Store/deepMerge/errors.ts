/* eslint-disable max-classes-per-file */

export class DeepMergeCircularError extends Error {
  constructor() {
    super('DeepMerge does not handle circular references.');
  }
}

export class PierceWrongTargetError extends Error {
  constructor(target: any) {
    super(`Target ${target} can't be pierced`);
  }
}

export class PierceWrongKeyError extends Error {
  constructor(key: any) {
    super(`Pierce error: Item with key ${key} not found`);
  }
}
