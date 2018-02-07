import { Action } from '@ngrx/store';

export const ADD_TO_COMPARE_LIST = '[Shopping] Add product to compare list';
export const REMOVE_FROM_COMPARE_LIST = '[Shopping] Remove product from compare list';
export const TOGGLE_COMPARE = '[Shopping] Toggle product on compare list';

export class AddToCompareList implements Action {
  readonly type = ADD_TO_COMPARE_LIST;
  constructor(public payload: string) { }
}

export class RemoveFromCompareList implements Action {
  readonly type = REMOVE_FROM_COMPARE_LIST;
  constructor(public payload: string) { }
}

export class ToggleCompare implements Action {
  readonly type = TOGGLE_COMPARE;
  constructor(public payload: string) { }
}

export type CompareListAction =
  AddToCompareList |
  RemoveFromCompareList |
  ToggleCompare;
