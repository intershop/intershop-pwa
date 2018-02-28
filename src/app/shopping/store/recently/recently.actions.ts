import { Action } from '@ngrx/store';

export enum RecentlyActionTypes {
  AddToRecently = '[Shopping] Add Product to Recently'
}

export class AddToRecently implements Action {
  readonly type = RecentlyActionTypes.AddToRecently;
  constructor(public payload: string) { }
}

export type RecentlyAction =
  AddToRecently;
