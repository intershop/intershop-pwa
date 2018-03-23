import { Action } from '@ngrx/store';

export enum RecentlyActionTypes {
  AddToRecently = '[Shopping] Add Product to Recently',
  ClearRecently = '[Shopping] Clear Recently'
}

export class AddToRecently implements Action {
  readonly type = RecentlyActionTypes.AddToRecently;
  constructor(public payload: string) { }
}

export class ClearRecently implements Action {
  readonly type = RecentlyActionTypes.ClearRecently;
}

export type RecentlyAction =
  | AddToRecently
  | ClearRecently;
