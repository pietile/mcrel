import {
  DeepMergeCircularError,
  PierceWrongKeyError,
  PierceWrongTargetError,
  deepMerge,
  pierce,
} from '../deepMerge';

test('single value', () => {
  interface State {
    a: number;
  }

  const obj: State = {
    a: 0,
  };

  const newObj = deepMerge(obj, { a: 1 });

  expect(newObj).toEqual({ a: 1 });
  expect(newObj).not.toBe(obj);
});

test('primitive', () => {
  interface State {
    a: number;
    b: number;
  }

  const obj: State = {
    a: 0,
    b: 0,
  };

  expect(deepMerge(obj, { a: 1 })).toEqual({ a: 1, b: 0 });
});

test('shallow', () => {
  interface State {
    a: number;
    b: number;
  }

  const obj: State = {
    a: 0,
    b: 0,
  };

  expect(deepMerge(obj, { a: 1, b: 1 })).toEqual({ a: 1, b: 1 });
});

test('nested', () => {
  interface State {
    a: number;
    subObj1: {
      b: string;
      c: boolean;
      subSubObj: {
        d: number;
      };
    };
    subObj2: {
      e: number;
    };
  }

  const obj: State = {
    a: 0,
    subObj1: {
      b: 'b',
      c: false,
      subSubObj: {
        d: 0,
      },
    },
    subObj2: {
      e: 0,
    },
  };

  const newObj = deepMerge(obj, { subObj1: { b: 'newB' } });

  expect(newObj).toEqual({
    a: 0,
    subObj1: {
      b: 'newB',
      c: false,
      subSubObj: {
        d: 0,
      },
    },
    subObj2: {
      e: 0,
    },
  });
  expect(newObj.subObj1).not.toBe(obj.subObj1);
  expect(newObj.subObj2).toBe(obj.subObj2);
});

test('undefined', () => {
  interface State {
    a?: number;
    b?: string;
    c?: boolean;
    d?: number[];
    e?: Map<number, number>;
    f?: Set<number>;
    subObj?: {
      g: number;
    };
  }

  const obj: State = {
    a: 1,
    b: 'b',
    c: true,
    d: [1, 2, 3],
    e: new Map(),
    f: new Set(),
    subObj: {
      g: 0,
    },
  };

  expect(
    deepMerge(obj, {
      a: undefined,
      b: undefined,
      c: undefined,
      d: undefined,
      e: undefined,
      f: undefined,
      subObj: undefined,
    }),
  ).toEqual({});

  const map = new Map<number, number>([[1, 1]]);
  const set = new Set<number>([1, 2, 3]);

  expect(
    deepMerge(obj, {
      a: 1,
      b: 'b',
      c: true,
      d: [1, 2, 3],
      e: map,
      f: set,
      subObj: {
        g: 1,
      },
    }),
  ).toEqual({
    a: 1,
    b: 'b',
    c: true,
    d: [1, 2, 3],
    e: map,
    f: set,
    subObj: {
      g: 1,
    },
  });
});

test('deep undefined', () => {
  interface State {
    a?: number;
    subObj?: {
      b: string;
      c?: boolean;
      subSubObj?: {
        d: number;
        e?: string;
      };
    };
  }

  const obj1: State = {
    a: 1,
    subObj: {
      b: 'b',
      c: true,
      subSubObj: {
        d: 1,
        e: 'e',
      },
    },
  };

  const obj2 = deepMerge(obj1, {
    a: undefined,
    subObj: {
      b: 'newB',
      subSubObj: undefined,
    },
  });

  expect(obj2).toEqual({
    subObj: {
      b: 'newB',
      c: true,
    },
  });

  const obj3 = deepMerge(obj2, {
    subObj: {
      c: false,
      subSubObj: {
        d: 2,
      },
    },
  });

  expect(obj3).toEqual({
    subObj: {
      b: 'newB',
      c: false,
      subSubObj: {
        d: 2,
      },
    },
  });
});

test('null', () => {
  interface State {
    a: number | null;
    b: string | null;
    c: boolean | null;
    d: number[] | null;
    e: Map<number, number> | null;
    f: Set<number> | null;
    subObj: {
      g: number;
    } | null;
  }

  const obj: State = {
    a: 1,
    b: 'b',
    c: true,
    d: [1, 2, 3],
    e: new Map(),
    f: new Set(),
    subObj: {
      g: 0,
    },
  };

  expect(
    deepMerge(obj, {
      a: null,
      b: null,
      c: null,
      d: null,
      e: null,
      f: null,
      subObj: null,
    }),
  ).toEqual({
    a: null,
    b: null,
    c: null,
    d: null,
    e: null,
    f: null,
    subObj: null,
  });

  const map = new Map<number, number>([[1, 1]]);
  const set = new Set<number>([1, 2, 3]);

  expect(
    deepMerge(obj, {
      a: 1,
      b: 'b',
      c: true,
      d: [1, 2, 3],
      e: map,
      f: set,
      subObj: {
        g: 1,
      },
    }),
  ).toEqual({
    a: 1,
    b: 'b',
    c: true,
    d: [1, 2, 3],
    e: map,
    f: set,
    subObj: {
      g: 1,
    },
  });
});

test('deep null', () => {
  interface State {
    a: number | null;
    subObj: {
      b: string;
      c: boolean | null;
      subSubObj: {
        d: number;
        e: string | null;
      } | null;
    } | null;
  }

  const obj1: State = {
    a: 1,
    subObj: {
      b: 'b',
      c: true,
      subSubObj: {
        d: 1,
        e: 'e',
      },
    },
  };

  const obj2 = deepMerge(obj1, {
    a: null,
    subObj: {
      b: 'newB',
      subSubObj: null,
    },
  });

  expect(obj2).toEqual({
    a: null,
    subObj: {
      b: 'newB',
      c: true,
      subSubObj: null,
    },
  });

  const obj3 = deepMerge(obj2, {
    subObj: {
      c: false,
      subSubObj: {
        d: 2,
        e: null,
      },
    },
  });

  expect(obj3).toEqual({
    a: null,
    subObj: {
      b: 'newB',
      c: false,
      subSubObj: {
        d: 2,
        e: null,
      },
    },
  });
});

test('array', () => {
  interface State {
    a: number[];
    b: { c: string }[];
  }

  const obj: State = {
    a: [1, 2, 3],
    b: [{ c: 'c1' }, { c: 'c2' }, { c: 'c3' }],
  };

  expect(deepMerge(obj, { a: [0] })).toEqual({
    a: [0],
    b: [{ c: 'c1' }, { c: 'c2' }, { c: 'c3' }],
  });

  const newB = Array.from(obj.b);
  newB[0] = { c: 'newC1' };

  expect(deepMerge(obj, { b: newB })).toEqual({
    a: [1, 2, 3],
    b: [{ c: 'newC1' }, { c: 'c2' }, { c: 'c3' }],
  });
});

test('map', () => {
  interface State {
    a: Map<number, string>;
    b: Map<number, { c: string }>;
  }

  const obj: State = {
    a: new Map([[1, 'a1']]),
    b: new Map([
      [1, { c: 'c1' }],
      [2, { c: 'c2' }],
    ]),
  };

  const newA = new Map(obj.a);
  newA.set(2, 'a2');

  expect(deepMerge(obj, { a: newA })).toEqual({
    a: new Map([
      [1, 'a1'],
      [2, 'a2'],
    ]),
    b: new Map([
      [1, { c: 'c1' }],
      [2, { c: 'c2' }],
    ]),
  });
});

test('set', () => {
  interface State {
    a: Set<string>;
    b: Set<{ c: string }>;
  }

  const obj: State = {
    a: new Set(['a1', 'a2']),
    b: new Set([{ c: 'c1' }, { c: 'c2' }]),
  };

  const newA = new Set(obj.a);
  newA.delete('a2');

  expect(deepMerge(obj, { a: newA })).toEqual({
    a: new Set(['a1']),
    b: new Set([{ c: 'c1' }, { c: 'c2' }]),
  });
});

test('atomics', () => {
  interface State {
    array: number[];
    date: Date;
    func: () => void;
    map: Map<number, number>;
    promise: Promise<void>;
    regexp: RegExp;
    set: Set<number>;
    weakMap: WeakMap<{ a: number }, number>;
    weakSet: WeakSet<{ a: number }>;
  }

  const weakKey = { a: 1 };

  const obj: State = {
    array: [1],
    date: new Date(1),
    func: () => {},
    map: new Map([[1, 1]]),
    promise: Promise.resolve(),
    regexp: /d+/,
    set: new Set([1]),
    weakMap: new WeakMap([[weakKey, 1]]),
    weakSet: new WeakSet([weakKey]),
  };

  const newArray = [2];

  const newObj1 = deepMerge(obj, {
    array: newArray,
  });

  expect(newObj1.array).toBe(newArray);
  expect(newObj1.date).toBe(obj.date);

  const newWeakKey = { a: 2 };

  const newDate = new Date(2);
  const newFunc = () => {};
  const newMap = new Map([[2, 2]]);
  const newPromise = Promise.resolve();
  const newRegexp = /d+/;
  const newSet = new Set([2]);
  const newWeakMap = new WeakMap([[newWeakKey, 2]]);
  const newWeakSet = new WeakSet([newWeakKey]);

  const newObj2 = deepMerge(newObj1, {
    date: newDate,
    func: newFunc,
    map: newMap,
    promise: newPromise,
    regexp: newRegexp,
    set: newSet,
    weakMap: newWeakMap,
    weakSet: newWeakSet,
  });

  expect(newObj2.array).toBe(newObj1.array);
  expect(newObj2.date).toBe(newDate);
  expect(newObj2.func).toBe(newFunc);
  expect(newObj2.map).toBe(newMap);
  expect(newObj2.promise).toBe(newPromise);
  expect(newObj2.regexp).toBe(newRegexp);
  expect(newObj2.set).toBe(newSet);
  expect(newObj2.weakMap).toBe(newWeakMap);
  expect(newObj2.weakSet).toBe(newWeakSet);
});

test('custom atomic', () => {
  class Atomic {
    private a = 0;

    constructor(value: number) {
      this.a = value;
    }

    foo() {
      return this.a;
    }
  }

  function isAtomic(value: any): value is Atomic {
    return value instanceof Atomic;
  }

  interface State {
    a: number;
    atomic: Atomic;
    optionalAtomic?: Atomic;
  }

  const atomic1 = new Atomic(1);
  (atomic1 as any).zxc = 'zxc';

  const atomic2 = new Atomic(2);

  const obj: State = {
    a: 0,
    atomic: atomic1,
  };

  const newObj1 = deepMerge(obj, { a: 1, atomic: atomic2 }, [isAtomic]);

  expect(newObj1.atomic).toBe(atomic2);

  const atomic3 = new Atomic(2);

  const newObj2 = deepMerge(newObj1, { optionalAtomic: atomic3 }, [isAtomic]);

  expect(newObj2.optionalAtomic).toBe(atomic3);

  const newObj3 = deepMerge(newObj1, { optionalAtomic: undefined }, [isAtomic]);

  expect(newObj3.optionalAtomic).toBe(undefined);
});

test('circular', () => {
  interface State {
    a: number;
    s?: State;
  }

  const obj: State = {
    a: 0,
  };

  obj.s = obj;

  function mergeCircular() {
    deepMerge(obj, { s: obj });
  }

  expect(mergeCircular).toThrowError(DeepMergeCircularError);
});

test('pierce primitive', () => {
  interface State {
    array: number[];
    map: Map<number, string>;
  }

  const obj: State = {
    array: [1, 2, 3],
    map: new Map([
      [1, 'a'],
      [2, 'b'],
    ]),
  };

  const newObj = deepMerge(obj, {
    array: pierce(0, 4),
    map: pierce(2, 'bbb'),
  });

  expect(newObj.array).not.toBe(obj.array);
  expect(newObj.array).toEqual([4, 2, 3]);

  expect(newObj.map).not.toBe(obj.map);
  expect(newObj.map).toEqual(
    new Map([
      [1, 'a'],
      [2, 'bbb'],
    ]),
  );
});

test('pierce object', () => {
  interface Value {
    a: number;
    subObj: {
      b: string;
      c?: number;
    };
  }

  interface State {
    array: Value[];
    map: Map<string, Value>;
  }

  const obj: State = {
    array: [
      { a: 1, subObj: { b: 'b' } },
      { a: 2, subObj: { b: 'b', c: 2 } },
    ],
    map: new Map([
      ['a', { a: 1, subObj: { b: 'b' } }],
      ['b', { a: 2, subObj: { b: 'b', c: 2 } }],
    ]),
  };

  const newObj = deepMerge(obj, {
    array: pierce(0, { a: 2 }),
    map: pierce('b', { subObj: { b: 'bbb', c: undefined } }),
  });

  expect(newObj.array).not.toBe(obj.array);
  expect(newObj.array).toEqual([
    { a: 2, subObj: { b: 'b' } },
    { a: 2, subObj: { b: 'b', c: 2 } },
  ]);

  expect(newObj.map).not.toBe(obj.map);
  expect(newObj.map).toEqual(
    new Map([
      ['a', { a: 1, subObj: { b: 'b' } }],
      ['b', { a: 2, subObj: { b: 'bbb' } }],
    ]),
  );
});

test('pierce excetions', () => {
  interface Value {
    a: number;
    subObj: {
      b: string;
      c?: number;
    };
  }

  interface State {
    array: Value[];
    map: Map<string, Value>;
    falseMap: Map<string, Value>;
  }

  const obj: State = {
    array: [
      { a: 1, subObj: { b: 'b' } },
      { a: 2, subObj: { b: 'b', c: 2 } },
    ],
    map: new Map([
      ['a', { a: 1, subObj: { b: 'b' } }],
      ['b', { a: 2, subObj: { b: 'b', c: 2 } }],
    ]),
    falseMap: {} as any,
  };

  function mergeWrongMapKey() {
    deepMerge(obj, {
      map: pierce('c', { a: 3 }),
    });
  }

  expect(mergeWrongMapKey).toThrowError(PierceWrongKeyError);

  function mergeWrongArrayKey() {
    deepMerge(obj, {
      array: pierce(3, { a: 3 }),
    });
  }

  expect(mergeWrongArrayKey).toThrowError(PierceWrongKeyError);

  function mergeWrongTarget() {
    deepMerge(obj, {
      falseMap: pierce('a', { a: 1 }),
    });
  }

  expect(mergeWrongTarget).toThrowError(PierceWrongTargetError);
});
