<p align="center">
    <img alt="Mcrel" src="https://gist.github.com/mxck/cda2ac634d5be2180840f2e7d36b59e1/raw/18e271b5ca3143fe2bd29ed86ba40da2ef25b582/mcrel-logo.png" width="273">
</p>

---

Mcrel is a state management library for React and TypeScript. The main idea is using type checking for
doing deep updates so you can safely use good old [setState](https://reactjs.org/docs/react-component.html#setstate)-like
API but with nesting. Mcrel checks statically that value of the update is a strict subset of the
state and does all the tedious work of recreating underlying objects.

```ts
interface User {
  name: {
    firstName: string;
    lastName: string;
  };
  age: number;
}

interface StoreState {
  user?: User;
  loaded: boolean;
}

const store = new Store<StoreState>({
  loaded: false,
});

store.setState({
  user: {
    name: {
      firstName: 'Solid',
      lastName: 'Snake',
    },
    age: 42,
  },
  loaded: true,
}); // Ok: user is User, loaded is boolean

store.setState({ user: { name: 'Liquid Snake', age: 33 } }); // Error: user.name is object

store.setState({ user: { name: { firstName: 'Liquid' }, age: 33 } }); // Ok: user.name.firstName is string, user.age is number

store.setState({ user: { realName: 'Big Boss' } }); // Error: user has no field realName

store.setState({ user: undefined, loaded: false }); // Ok: user is undefined, loaded is boolean
```

## Example

There is classic todo-list example is [available](/example).

## Usage

Mcrel can be used as a global state (like [Redux](https://github.com/reduxjs/redux)) and as a local state (like useState).
TypeScript [strictNullChecks](https://www.typescriptlang.org/docs/handbook/compiler-options.html) is
required for Mcrel to work properly.

### Global state

1. Define `State` and create a `Store` instances.

   ```ts
   import { Store } from 'mcrel';

   interface StoreState {
     value: number;
     timestamp: Date;
   }

   export const store = new Store<StoreState>({ value: 0, timestamp: new Date() });
   ```

2. Put `Provider` at top level of your app and pass store from step one to its props.

   ```tsx
   import React from 'react';

   import { Provider } from 'mcrel';
   import ReactDOM from 'react-dom';

   import App from './App';
   import { store } from './store';

   const rootElement = document.getElementById('root');

   ReactDOM.render(
     <Provider store={store}>
       <App />
     </Provider>,
     rootElement,
   );
   ```

3. Use `useMcrelSelector` hook or `connect` function to read values from `Store`.

   ```tsx
   import React from 'react';

   import { useMcrelSelector } from 'mcrel';

   export default function Year() {
     const timestamp = useMcrelSelector(({ timestamp }) => timestamp);

     return <div>{timestamp.getYear()}</div>;
   }
   ```

   or

   ```tsx
   import React from 'react';

   import { connect } from 'mcrel';

   interface Props {
     value: number;
   }

   function Value({ value }: Props) {
     return <div>{value}</div>;
   }

   export default connect(
     Value,
     ({ value }) => ({ value }),
   );
   ```

4) Use `Store.setState` to update the store.

   ```tsx
   import React from 'react';

   import { store } from './store';

   function UpButton() {
     return (
       <button
         onClick={() => {
           store.setState(({ value }) => ({ value: value + 1, timestamp: new Date() }));
         }}
       >
         Up
       </button>
     );
   }
   ```

### Local state

Just use `useMcrelState` hook as a `useState` but with all Mcrel update functionality.

```tsx
import React from 'react';

import { useMcrelState } from 'mcrel';

function MyComponent() {
  const [data, setData] = useMcrelState({
    value: {
      count: 0,
      color: 'red',
    },
    timestamp: new Date(),
  });

  return (
    <div>
      <div style={{ backgroundColor: data.value.color }}>{data.value.count}</div>
      <div>{data.timestamp}</div>

      <button
        onClick={() => {
          const { count } = data.value;

          setData({
            value: { count: count + 1, color: count % 2 ? 'aqua' : 'maroon' },
            timestamp: new Date(),
          });
        }}
      >
        Up
      </button>
    </div>
  );
}
```

## API

## Store

Store contains the global state of the app. Its instance is intended to be used as singleton.

### `new Store<T, G>(state: T, atomicGuards?: G): Store<T, G>`

Straight forward way for creating the Store. Set `state` as initial store state. With optional
[`atomicGuards`](#atomic-guards) parameters you can specify the list of atomic objects for store
(`Array` of type guard functions).

```ts
import { Store } from 'mcrel';

interface State {
  value: number;
}

const store = new Store<State>({ value: 0 });
```

### `createStore<T>(state: T): (<G>(atomicGuards: G) => Store<T, G>)`

Factory function for creating Store. Helpful when setting atomic guards so you can explicitly set
type of the Store state and omit type of the atomic guards list (`Array` of type guard functions).

```ts
import { DateTime } from 'luxon';
import { createStore } from 'mcrel';

interface State {
  date: DateTime;
}

function isDateTime(value: any): value is DateTime {
  return value instanceof DateTime;
}

const store = createStore<State>({
  date: DateTime.local(),
})([isDateTime]);
```

### `Store.setState<P>(arg: P | ((state: DeepReadonlyObject<T>) => P): DeepReadonlyObject<T>`

Set store state and notify all subscriptions. `arg` is either a object that should be
strict subset of the State or a function that receives store state as argument and should return
object that should be strict subset of the State. Returns new store state.

```ts
import { DeepReadonlyObject, Store } from 'mcrel';

interface State {
  num: number;
  obj: {
    bool: boolean;
    str: string;
  };
}

const store = new Store<State>({
  num: 0,
  obj: {
    bool: true,
    str: '',
  },
});

store.setState({
  num: 1,
  obj: {
    str: 'hello',
  },
});

store.setState((state: DeepReadonlyObject<State>) => ({
  num: state.num + 1,
  obj: {
    bool: !state.obj.bool,
  },
}));
```

### `Store.subscribe(callback: (state: DeepReadonlyObject<T>) => void): Unsubscribe`

Subscribe for store updates. `callback` will be called on each store state change. Returns function
that should be called when you want to unsubscribe.

```ts
import { DeepReadonlyObject, Store } from 'mcrel';

interface State {
  user: string;
}

const store = new Store<State>({ user: 'Darth Sidious' });

const unsubscribe = store.subscribe((state: DeepReadonlyObject<State>) => {
  console.log(state);
});
```

## Components

### `<Provider store={store} />`

All components that use `useMcrelSelector` or `connect` must be descendants of the `Provider`.

```tsx
import React from 'react';

import { Provider } from 'mcrel';

import { store } from './store';
import Root from './Root';

export default function App() {
  return (
    <Provider store={store}>
      <Root />
    </Provider>
  );
}
```

## HOC

### `connect<P, R, S>(Component: ComponentType<P & R>, selector: Selector<S, R>, compareFunction: CompareFunction<R>): FunctionComponent<P>`

Create connected to store component. Mostly exist for Class components. `Component` is React
component that will receive values selected in `selector` function in props. `compareFunction` is used
to to determine whether the selected data has changed or not. By default `connect` use
[shallowEqual](#shallowequalobja-any-objb-any-boolean) for `compareFunction` but you can specify your own function to optimize updates.

```tsx
import React from 'react';

import { connect } from 'mcrel';

interface Props {
  starsCount: number;
}

function StarsCounter({ starsCount }: Props) {
  return <div>{starsCount}</div>;
}

export default connect(
  StarsCounter,
  ({ starsCount }) => ({ starsCount }),
);
```

## Hooks

### `useMcrelSelector<S, R>(selector: Selector<S, R>, compareFunction: CompareFunction<R>): R`

Select values from store and subscribe for its updates. `selector` is a function that receives store
state as argument and should return any value. The hook use `compareFunction` to determine whether
the selected data has changed or not. The default `compareFunction` is by value comparison (i.e. `===`) but
you can specify your own function to optimize updates.

```tsx
import React from 'react';

import { useMcrelSelector } from 'mcrel';

export default function StarsCounter {
  const starsCount = useMcrelSelector(({ starsCount }) => starsCount);

  return <div>{starsCount}</div>;
}
```

### `useMcrelState<T>(state: T): [DeepReadonlyObject<T>, <P>(arg: P | ((state: DeepReadonlyObject<T>) => P)) => void]`

Use Mcrel for local state management.

```tsx
import React from 'react';

import { useMcrelState } from 'mcrel';

interface State {
  numbers: {
    value: number;
  }[];
  timestamp: Date;
}

function Component() {
  const [data, setData] = useMcrelState<State>({
    numbers: [],
    timestamp: new Date(),
  });

  return (
    <div>
      <div>
        {data.number.map(({ value }) => (
          <span>value</span>
        ))}
      </div>
      <div>{data.timestamp}</div>

      <button
        onClick={() => {
          const numbers = Array.from(data.numbers);
          numbers.push({ value: Math.random() });

          setData({
            numbers,
            timestamp: new Date(),
          });
        }}
      >
        One more
      </button>
    </div>
  );
}
```

## Utility

### `pierce<K, V>(key: K, value: V): Pierce<K, V>`

Piercing is a powerful feature that allows using Mcrel for updating through key-value collections
(`Array` and `Map`). Pass `key` of updating object as first parameter and Mcrel update `value`
as second.

```ts
import { Store, pierce } from 'mcrel';

interface State {
  jedi: Map<number, { name: string; message: string }>;
}

const store = new Store<State>({
  jedi: new Map([
    [1, { name: 'Obi-Wan Kenobi', message: 'Hello there!' }],
    [2, { name: 'Anakin Skywalker', message: 'I HATE YOU!' }],
  ]),
});

store.setState({ jedi: pierce(2, { name: 'Darth Vader' }) });
```

### `shallowEqual(objA: any, objB: any): boolean`

Performs equality by iterating through keys on an object and returning false when any key has
values which are not strictly equal between the arguments. Returns true when the values of all keys
are strictly equal.

## Atomic Guards

Atomic guard is a TypeScript [guard function](https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards) that define custom atomic object for Mcrel. Atomics can't be updated partially and always set using
direct assignment. Mcrel already supports built in JavaScript atomics like `Date`, `Regex` and other.

```ts
import { createStore } from 'mcrel';

class MyAtomicType {
  private counter = 0;

  up() {
    this.counter++;
  }
}

interface State {
  value: MyAtomicType;
}

function isMyAtomicType(value: any): value is MyAtomicType {
  return value instanceof MyAtomicType;
}

const store = createStore<State>({
  value: new MyAtomicType(),
})([isMyAtomicType]);
```

## Acknowledgements

Special thanks to [Nastya Loginova](https://www.behance.net/nastasyalo6a69) for creating a project logo.

## License

Mcrel is MIT License.
