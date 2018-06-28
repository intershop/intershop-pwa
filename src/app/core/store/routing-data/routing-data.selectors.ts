import { createSelector } from '@ngrx/store';
import { CoreState } from '../core.state';

const getRoutingDataState = (state: CoreState) => state.routingData;

export const getRoutingData = <T>(key: string) => createSelector(getRoutingDataState, state => state.data[key] as T);
