import { Action } from '@ngrx/store';

export enum CompareActionTypes {
  AddToCompare = '[Shopping] Add Product to Compare',
  RemoveFromCompare = '[Shopping] Remove Product from Compare',
  ToggleCompare = '[Shopping] Toggle Product Compare',
}

export class AddToCompare implements Action {
  readonly type = CompareActionTypes.AddToCompare;
  constructor(public payload: { sku: string }) {}
}

export class RemoveFromCompare implements Action {
  readonly type = CompareActionTypes.RemoveFromCompare;
  constructor(public payload: { sku: string }) {}
}

export class ToggleCompare implements Action {
  readonly type = CompareActionTypes.ToggleCompare;
  constructor(public payload: { sku: string }) {}
}

export type CompareAction = AddToCompare | RemoveFromCompare | ToggleCompare;
