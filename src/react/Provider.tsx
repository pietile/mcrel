import React from 'react';

import { Store } from '../Store';

import { Context } from './Context';

interface Props<T> {
  children?: React.ReactNode;
  store: Store<T>;
}

export function Provider<T>({ store, children }: Props<T>): JSX.Element {
  return <Context.Provider value={store}>{children}</Context.Provider>;
}
