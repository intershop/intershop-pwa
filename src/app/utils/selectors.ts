import { MemoizedSelector, Selector, createSelector } from '@ngrx/store';

export const firstTruthy = <State, S1, S2>(
  s1: Selector<State, S1>,
  s2: Selector<State, S2>
): MemoizedSelector<State, S1 | S2> => createSelector(s1, s2, (a, b) => (!!a ? a : b));
