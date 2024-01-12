import { Injectable, InjectionToken, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreConfig, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { resetOnLogoutMeta } from 'ish-core/utils/meta-reducers';

import { ReturnRequestsState } from './return-request-store';
import { ReturnRequestEffects } from './return-request/return-request.effects';
import { returnRequestReducer } from './return-request/return-request.reducer';

const returnRequestReducers: ActionReducerMap<ReturnRequestsState> = {
  returnRequest: returnRequestReducer,
};

const returnRequestEffects = [ReturnRequestEffects];

@Injectable()
export class DefaultReturnRequestStoreConfig implements StoreConfig<ReturnRequestsState> {
  metaReducers = [resetOnLogoutMeta];
}

export const RETURN_REQUEST_STORE_CONFIG = new InjectionToken<StoreConfig<ReturnRequestsState>>(
  'returnRequestStoreConfig'
);

@NgModule({
  imports: [
    EffectsModule.forFeature(returnRequestEffects),
    StoreModule.forFeature('returnRequest', returnRequestReducers, RETURN_REQUEST_STORE_CONFIG),
  ],
  providers: [{ provide: RETURN_REQUEST_STORE_CONFIG, useClass: DefaultReturnRequestStoreConfig }],
})
export class ReturnRequestStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<ReturnRequestsState>)[]) {
    return StoreModule.forFeature('returnRequest', pick(returnRequestReducers, reducers));
  }
}
