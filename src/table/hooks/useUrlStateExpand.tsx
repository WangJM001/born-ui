import { useCallback, useMemo, useState } from 'react';
import useUrlState from '@ahooksjs/use-url-state';
import { merge, omit, pick } from 'lodash';

export interface ObjState {
  [key: string]: any;
}

export interface Options<S> {
  enable?: boolean;
  /** 排除属属，不在url query中显示，enable 为 true时有效 */
  excludes?: string[];
  /** state返回结果格式化，主要用于url query string->number */
  formatter?: (state: S) => any;
}

export default <S extends ObjState = ObjState>(
  initialState: S,
  options?: Options<S>,
): [S, (state: S) => void] => {
  const { enable, excludes = [], formatter } = options || {};
  const [innerState, setInnerState] = useState<S>(initialState);
  const [urlState, setUrlState] = useUrlState<Partial<S>>(
    () => {
      if (enable && initialState) {
        return omit<S>(initialState, excludes);
      }
      return initialState;
    },
    { navigateMode: 'replace' },
  );
  const [excludesState, setExcludesState] = useState<Partial<S>>(() => {
    if (enable && initialState && excludes.length) {
      return pick<S>(initialState, excludes);
    }
    return {};
  });

  const state: S = useMemo(() => {
    let finalState;
    if (!enable) {
      finalState = innerState;
    } else {
      finalState = merge<Partial<S>, Partial<S>>(urlState, excludesState) as S;
    }
    return formatter ? formatter(finalState) : finalState;
  }, [enable, innerState, urlState, excludesState]);

  const setState: (s: S) => void = useCallback(
    (newState) => {
      if (!enable) {
        setInnerState(newState);
      } else {
        setUrlState(() => omit<S>(newState, excludes));
        setExcludesState(pick<S>(newState, excludes));
      }
    },
    [excludes],
  );

  return [state, setState];
};
