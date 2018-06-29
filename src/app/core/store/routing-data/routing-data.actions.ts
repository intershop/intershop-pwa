import { Action } from '@ngrx/store';

export enum RoutingDataActionTypes {
  SetRoutingData = '[Router Internal] Set Routing Data',
}

export class SetRoutingData implements Action {
  readonly type = RoutingDataActionTypes.SetRoutingData;
  // tslint:disable-next-line:no-any
  constructor(public payload: { [key: string]: any }) {}
}
