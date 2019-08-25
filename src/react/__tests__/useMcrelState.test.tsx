import { act, renderHook } from '@testing-library/react-hooks';

import { useMcrelState } from '../useMcrelState';

describe('useSelector', () => {
  it('should return updated state', () => {
    const { result } = renderHook(() => useMcrelState({ a: 1, b: 'b' }));

    act(() => {
      result.current[1]({ a: 2 });
    });

    expect(result.current[0]).toEqual({ a: 2, b: 'b' });

    act(() => {
      result.current[1](({ b }) => ({ b: `*${b}*` }));
    });

    expect(result.current[0]).toEqual({ a: 2, b: '*b*' });
  });
});
