import { Action } from '@ngrx/store';


export enum CompareListActionTypes {
  ADD_TO_COMPARE_LIST = '[Shopping] Add product to compare list',
  REMOVE_FROM_COMPARE_LIST = '[Shopping] Remove product from compare list',
  TOGGLE_COMPARE = '[Shopping] Toggle product on compare list'
}

export class AddToCompareList implements Action {
  readonly type = CompareListActionTypes.ADD_TO_COMPARE_LIST;
  constructor(public payload: string) { }
}

export class RemoveFromCompareList implements Action {
  readonly type = CompareListActionTypes.REMOVE_FROM_COMPARE_LIST;
  constructor(public payload: string) { }
}

export class ToggleCompare implements Action {
  readonly type = CompareListActionTypes.TOGGLE_COMPARE;
  constructor(public payload: string) { }
}

export type CompareListAction =
  AddToCompareList |
  RemoveFromCompareList |
  ToggleCompare;
