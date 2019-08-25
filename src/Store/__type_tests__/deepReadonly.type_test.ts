import { DeepReadonlyObject } from '../deepReadonly';

interface SubState {
  a: string;
  subObj: {
    b: number;
  };
  array: string[];
}

interface State {
  a: number;
  subObj: {
    b: SubState;
  };
  array: SubState[];
  map: Map<SubState, SubState>;
  set: Set<SubState>;
  readonlysubObj: {
    readonly c: SubState;
  };
  readonlyArray: ReadonlyArray<SubState>;
  readonlyMap: ReadonlyMap<SubState, SubState>;
  readonlySet: ReadonlySet<SubState>;
}

type ReadonlyState = DeepReadonlyObject<State>;

const sub: SubState = {
  a: 'a',
  subObj: {
    b: 0,
  },
  array: ['a', 'b'],
};

// @dts-jest:pass:snap
const obj: ReadonlyState = {
  a: 0,
  subObj: {
    b: sub,
  },
  array: [sub],
  map: new Map([[sub, sub]]),
  set: new Set([sub]),
  readonlysubObj: {
    c: sub,
  },
  readonlyArray: [sub],
  readonlyMap: new Map([[sub, sub]]),
  readonlySet: new Set([sub]),
};

// @dts-jest:fail:snap
obj.a = 1;

// @dts-jest:fail:snap
obj.subObj.b = sub;
// @dts-jest:fail:snap
obj.subObj.b.a = 1;
// @dts-jest:fail:snap
obj.subObj.b.subObj.b = 1;
// @dts-jest:fail:snap
obj.subObj.b.array.pop();

{
  const value = obj.map.get(sub);
  if (value) {
    // @dts-jest:fail:snap
    value.a = 1;
  }
}

obj.set.forEach((value) => {
  // @dts-jest:fail:snap
  value.a = 1;
});

// @dts-jest:fail:snap
obj.readonlysubObj.c = sub;
// @dts-jest:fail:snap
obj.readonlysubObj.c.a = 1;
// @dts-jest:fail:snap
obj.readonlysubObj.c.subObj.b = 1;
// @dts-jest:fail:snap
obj.readonlysubObj.c.array.pop();

{
  const value = obj.readonlyMap.get(sub);
  if (value) {
    // @dts-jest:fail:snap
    value.a = 1;
  }
}

obj.readonlySet.forEach((value) => {
  // @dts-jest:fail:snap
  value.a = 1;
});
