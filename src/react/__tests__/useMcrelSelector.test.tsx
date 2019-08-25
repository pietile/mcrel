import React, { useCallback, useState } from 'react';

import * as rtl from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';

import { Store } from '../../Store';
import { Provider } from '../Provider';
import { shallowEqual } from '../shallowEqual';
import { compareByValue, useMcrelSelector } from '../useMcrelSelector';

interface State {
  count: number;
}

describe('useMcrelSelector', () => {
  it('should return state', () => {
    const store = new Store<State>({ count: 0 });

    const { result } = renderHook(() => useMcrelSelector((s: State) => s.count), {
      wrapper: (props) => <Provider {...props} store={store} />,
    });

    expect(result.current).toBe(0);
  });

  it('should return updated state', () => {
    const store = new Store<State>({ count: 0 });

    const { result } = renderHook(() => useMcrelSelector((s: State) => s.count), {
      wrapper: (props) => <Provider {...props} store={store} />,
    });

    act(() => {
      store.setState({ count: 777 });
    });

    expect(result.current).toBe(777);
  });

  it('should return new value after new select function passed', () => {
    interface State {
      a: number;
      b: number;
    }

    const store = new Store<State>({ a: 0, b: 100 });

    const { result, rerender } = renderHook(({ selector }) => useMcrelSelector(selector), {
      wrapper: (props) => <Provider {...props} store={store} />,
      initialProps: { selector: (state: State) => state.a },
    });

    expect(result.current).toBe(0);

    rerender({ selector: (state: State) => state.b });

    expect(result.current).toBe(100);
  });

  it('should return old value with custom compare function', () => {
    const store = new Store<State>({ count: 100 });

    const { result, rerender } = renderHook(
      () => useMcrelSelector((state: State) => ({ count: state.count }), shallowEqual),
      { wrapper: (props) => <Provider {...props} store={store} /> },
    );

    expect(result.current).toEqual({ count: 100 });
    const value = result.current;

    rerender();

    expect(result.current).toBe(value);
  });

  it('should subscribe on new store', () => {
    let store: Store<State> = new Store<State>({ count: 0 });

    const renderedItems: number[] = [];
    let forceRender: React.Dispatch<React.SetStateAction<{}>>;

    const Comp = () => {
      const selector = useCallback(({ count }: State) => count, []);

      const value = useMcrelSelector(selector);
      renderedItems.push(value);
      return <div />;
    };

    const Container = () => {
      const [, f] = useState({});
      forceRender = f;

      return (
        <Provider store={store}>
          <Comp />
        </Provider>
      );
    };

    rtl.render(<Container />);

    expect(renderedItems).toEqual([0]);

    rtl.act(() => {
      store.setState({ count: 1 });
    });

    expect(renderedItems).toEqual([0, 1]);

    // Set new store
    store = new Store<State>({ count: 2 });
    rtl.act(() => forceRender && forceRender({}));

    expect(renderedItems).toEqual([0, 1, 2]);

    rtl.act(() => {
      store.setState({ count: 3 });
    });

    expect(renderedItems).toEqual([0, 1, 2, 3]);
  });

  it('should return new value after new compare function passed', () => {
    interface State {
      a: {};
    }

    const initial = {};
    const store = new Store<State>({ a: initial });

    const selector = (state: State) => state.a;

    const { result, rerender } = renderHook(
      ({ compareFunction }) => useMcrelSelector(selector, compareFunction),
      {
        wrapper: (props) => <Provider {...props} store={store} />,
        initialProps: { compareFunction: shallowEqual },
      },
    );

    expect(result.current).toBe(initial);

    const nextValue = {};
    act(() => {
      store.setState({ a: nextValue });
    });

    expect(result.current).toStrictEqual(initial);

    rerender({ compareFunction: compareByValue });

    expect(result.current).toStrictEqual(nextValue);
  });
});
