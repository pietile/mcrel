import { deepMerge, pierce } from '../deepMerge';

interface Atomic {
  type: 'unique';
  a: number;
  subObject: {
    b: string;
  };
}

interface SubState {
  a: number;
  subObj: {
    b: number;
    c?: string;
  };
}

interface State {
  a: number;
  b: string;
  subObj1: {
    c: number;
  };
  subObj2: {
    d: number;
  } | null;
  subObj3?: {
    d: number;
  };
  array: number[];
  map: Map<number, string>;
  set: Set<number | string>;
  atomic: Atomic;
  array2: SubState[];
  map2: Map<string, SubState>;
}

const obj: State = {
  a: 0,
  b: 'b',
  subObj1: {
    c: 0,
  },
  subObj2: {
    d: 0,
  },
  array: [1],
  map: new Map(),
  set: new Set([1, 'a']),
  atomic: {
    type: 'unique',
    a: 0,
    subObject: {
      b: 'b',
    },
  },
  array2: [],
  map2: new Map(),
};

function isAtomic(value: any): value is Atomic {
  return value.type === 'unique';
}

// @dts-jest:fail:snap Unknown field
deepMerge(obj, { c: 1 });

// @dts-jest:fail:snap Field type
deepMerge(obj, { b: 1 });

// @dts-jest:fail:snap null to NonNullable
deepMerge(obj, { subObj1: null });

// @dts-jest:fail:snap Incorrect subObj
deepMerge(obj, { subObj2: { a: 1 } });

// @dts-jest:fail:snap undefined to null
deepMerge(obj, { subObj2: undefined });

// @dts-jest:fail:snap value to nullable obj
deepMerge(obj, { subObj2: '' });

// @dts-jest:fail:snap null to undefined
deepMerge(obj, { subObj3: null });

// @dts-jest:fail:snap value to optional obj
deepMerge(obj, { subObj3: 1 });

// @dts-jest:fail:snap Map value type
deepMerge(obj, { array: new Map([[1, 1]]) });

// @dts-jest:fail:snap Array value type
deepMerge(obj, { array: [''] });

// @dts-jest:fail:snap Map key type
deepMerge(obj, { map: new Map([['1', '1']]) });

// @dts-jest:fail:snap Set value type
deepMerge(obj, { set: new Set([false]) });

deepMerge(
  obj,
  {
    // @dts-jest:fail:snap Custom Atomic value type
    atomic: {
      type: 'unique',
      subObject: {
        b: 'b',
      },
    },
  },
  [isAtomic],
);

// @dts-jest:fail:snap Pierce wrong target
deepMerge(obj, { atomic: pierce('a', 1) });

// @dts-jest:fail:snap Pierce array wrong key type
deepMerge(obj, { array2: pierce('a', { a: 1 }) });

// @dts-jest:fail:snap Pierce array wrong value type
deepMerge(obj, { array2: pierce(1, { b: null }) });

// @dts-jest:fail:snap Pierce map wrong key type
deepMerge(obj, { map2: pierce(1, { subObj: { b: 1 } }) });

// @dts-jest:fail:snap Pierce map wrong value type
deepMerge(obj, { map2: pierce('a', { subObj: { c: 1 } }) });
