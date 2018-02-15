import { Action } from '@ngrx/store';


export enum CompareListActionTypes {
  AddToCompareList = '[Shopping] Add product to compare list',
  RemoveFromCompareList = '[Shopping] Remove product from compare list',
  ToggleCompare = '[Shopping] Toggle product on compare list'
}

export class AddToCompareList implements Action {
  readonly type = CompareListActionTypes.AddToCompareList;
  constructor(public payload: string) { }
}

export class RemoveFromCompareList implements Action {
  readonly type = CompareListActionTypes.RemoveFromCompareList;
  constructor(public payload: string) { }
}

export class ToggleCompare implements Action {
  readonly type = CompareListActionTypes.ToggleCompare;
  constructor(public payload: string) { }
}

export type CompareListAction =
  AddToCompareList |
  RemoveFromCompareList |
  ToggleCompare;
