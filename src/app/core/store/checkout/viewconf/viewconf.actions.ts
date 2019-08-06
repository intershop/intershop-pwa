import { Action } from '@ngrx/store';

export enum ViewconfActionTypes {
  SetCheckoutStep = '[Viewconf Internal] Set Checkout Step',
}

export class SetCheckoutStep implements Action {
  readonly type = ViewconfActionTypes.SetCheckoutStep;
  constructor(public payload: { step: number }) {}
}

export type ViewconfActions = SetCheckoutStep;
