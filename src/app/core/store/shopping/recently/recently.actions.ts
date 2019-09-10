import { Action } from '@ngrx/store';

export enum RecentlyActionTypes {
  AddToRecently = '[Recently Viewed] Add Product to Recently',
  ClearRecently = '[Recently Viewed] Clear Recently',
}

export class AddToRecently implements Action {
  readonly type = RecentlyActionTypes.AddToRecently;
  constructor(public payload: { sku: string; group?: string }) {}
}

export class ClearRecently implements Action {
  readonly type = RecentlyActionTypes.ClearRecently;
}

export type RecentlyAction = AddToRecently | ClearRecently;
