import { pierce } from '../deepMerge';
import { Store, createStore } from '../Store';

test('subscription', () => {
  interface State {
    a: number;
    b: number;
  }

  const store = new Store<State>({ a: 0, b: 0 });

  const subscription = jest.fn();
  const unsubscribe = store.subscribe(subscription);

  store.setState({ a: 1 });
  expect(subscription.mock.calls.length).toBe(1);
  expect(subscription.mock.calls[0][0]).toEqual({ a: 1, b: 0 });

  unsubscribe();

  store.setState({ a: 1 });
  expect(subscription.mock.calls.length).toBe(1);
});

test('object immutability', () => {
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
    subObj1: {
      a: number;
      subSubObj: {
        b: number;
      };
    };
    subObj2: {
      c: string;
      subSubObj: {
        d: string;
      };
    };
    atomic: Atomic;
    array: { a: number }[];
  }

  const store = createStore<State>({
    subObj1: { a: 0, subSubObj: { b: 0 } },
    subObj2: { c: 'c1', subSubObj: { d: 'd1' } },
    atomic: new Atomic(1),
    array: [{ a: 1 }, { a: 2 }],
  })([isAtomic]);

  const state1 = store.getState();
  const state2 = store.setState({ subObj1: { a: 1 } });

  expect(state2).not.toBe(state1);
  expect(state2.subObj1).not.toBe(state1.subObj1);
  expect(state2.subObj1.subSubObj).toBe(state1.subObj1.subSubObj);
  expect(state2.subObj2).toBe(state1.subObj2);
  expect(state2.subObj2.subSubObj).toBe(state1.subObj2.subSubObj);

  const state3 = store.setState({ subObj2: { subSubObj: { d: 'd2' } } });

  expect(state3).not.toBe(state2);
  expect(state3.subObj1).toBe(state2.subObj1);
  expect(state3.subObj1.subSubObj).toBe(state2.subObj1.subSubObj);
  expect(state3.subObj2).not.toBe(state2.subObj2);
  expect(state3.subObj2.subSubObj).not.toBe(state2.subObj2.subSubObj);

  const newAtomic = new Atomic(1);
  const state4 = store.setState({ atomic: newAtomic });

  expect(state4).not.toBe(state3);
  expect(state4.atomic).not.toBe(state3.atomic);
  expect(state4.atomic).toBe(newAtomic);

  const state5 = store.setState({ array: pierce(1, { a: 3 }) });
  expect(state5).not.toBe(state4);
  expect(state5.array).not.toBe(state4.atomic);
  expect(state5.array).toEqual([{ a: 1 }, { a: 3 }]);
});
