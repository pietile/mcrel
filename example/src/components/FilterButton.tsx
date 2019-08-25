import React from 'react';

import { DeepReadonlyObject, useMcrelSelector } from 'mcrel';

import { Filter, StoreState, store } from '../store';

interface Props {
  value: Filter;
  children: React.ReactNode;
}

function FilterButton({ children, value }: Props): JSX.Element {
  const activeFilter = useMcrelSelector(
    ({ visibilityFilter }: DeepReadonlyObject<StoreState>) => visibilityFilter,
  );

  return (
    <button
      type="button"
      style={{
        marginLeft: 4,
      }}
      disabled={value === activeFilter}
      onClick={() => store.setState({ visibilityFilter: value })}
    >
      {children}
    </button>
  );
}

export default FilterButton;
