import React from 'react';

import * as rtl from '@testing-library/react';

import { Store } from '../../Store';
import { connect } from '../connect';
import { Provider } from '../Provider';

interface State {
  count: number;
  otherValue?: number;
}

describe('connect', () => {
  it('should pass value', () => {
    const store: Store<State> = new Store<State>({ count: 322 });
    let value: number | undefined;

    const Comp = connect(
      ({ count }) => {
        value = count;
        return <div />;
      },
      (state: State) => ({ count: state.count }),
    );

    const Container = () => {
      return (
        <Provider store={store}>
          <Comp />
        </Provider>
      );
    };

    rtl.render(<Container />);

    expect(value).toEqual(322);
  });

  it('should get updated state', () => {
    const store: Store<State> = new Store<State>({ count: 0 });
    let value: number | undefined;

    const Comp = connect(
      ({ count }) => {
        value = count;
        return <div />;
      },
      (state: State) => ({ count: state.count }),
    );

    const Container = () => {
      return (
        <Provider store={store}>
          <Comp />
        </Provider>
      );
    };

    rtl.render(<Container />);

    expect(value).toEqual(0);

    rtl.act(() => {
      store.setState({ count: 1 });
    });

    expect(value).toEqual(1);
  });

  it('should shallow compare selected', () => {
    const store: Store<State> = new Store<State>({ count: 0, otherValue: 0 });
    let value: number | undefined;

    const render = jest.fn();

    const Comp = connect(
      ({ count }) => {
        render();
        value = count;
        return <div />;
      },
      (state: State) => ({ count: state.count }),
    );

    const Container = () => {
      return (
        <Provider store={store}>
          <Comp />
        </Provider>
      );
    };

    rtl.render(<Container />);

    expect(value).toEqual(0);
    expect(render.mock.calls.length).toEqual(1);

    rtl.act(() => {
      store.setState({ count: 1 });
    });

    expect(value).toEqual(1);
    expect(render.mock.calls.length).toEqual(2);

    rtl.act(() => {
      store.setState({ count: 1 });
    });

    expect(value).toEqual(1);
    expect(render.mock.calls.length).toEqual(2);

    rtl.act(() => {
      store.setState({ otherValue: 777 });
    });

    expect(value).toEqual(1);
    expect(render.mock.calls.length).toEqual(2);
  });
});
