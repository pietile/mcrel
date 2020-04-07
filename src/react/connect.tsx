import React, { ComponentType, FunctionComponent } from 'react';

import hoistStatics from 'hoist-non-react-statics';

import { shallowEqual } from './shallowEqual';
import { CompareFunction, Selector, useMcrelSelector } from './useMcrelSelector';

export function connect<P, R extends object, S>(
  Component: ComponentType<P & R>,
  selector: Selector<S, R>,
  compareFunction: CompareFunction<R> = shallowEqual,
): FunctionComponent<P> {
  function ConnectedComponent(props: P): JSX.Element {
    const data = useMcrelSelector<S, R>(selector, compareFunction);

    return <Component {...data} {...props} />;
  }

  ConnectedComponent.displayName = `connected(${Component.displayName || Component.name})`;

  return hoistStatics(ConnectedComponent, Component);
}
