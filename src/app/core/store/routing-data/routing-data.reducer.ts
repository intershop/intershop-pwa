import { Action } from '@ngrx/store';
import { RoutingDataActionTypes, SetRoutingData } from './routing-data.actions';

export interface RoutingDataState {
  // tslint:disable-next-line:no-any
  data: { [key: string]: any };
}

const initialState: RoutingDataState = {
  data: {},
};

export function routingDataReducer(state = initialState, action: Action): RoutingDataState {
  if (action.type === RoutingDataActionTypes.SetRoutingData) {
    const data = (action as SetRoutingData).payload;
    return { data };
  }
  return state;
}
