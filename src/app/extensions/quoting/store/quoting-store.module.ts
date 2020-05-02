import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { resetOnLogoutMeta } from 'ish-core/utils/meta-reducers';

import { QuoteRequestEffects } from './quote-request/quote-request.effects';
import { quoteRequestReducer } from './quote-request/quote-request.reducer';
import { QuoteEffects } from './quote/quote.effects';
import { quoteReducer } from './quote/quote.reducer';
import { QuotingState } from './quoting-store';

/** @deprecated will be made private in version 0.23 */
export const quotingReducers: ActionReducerMap<QuotingState> = {
  quote: quoteReducer,
  quoteRequest: quoteRequestReducer,
};

/** @deprecated will be made private in version 0.23 */
export const quotingEffects = [QuoteEffects, QuoteRequestEffects];
// tslint:disable: deprecation

const metaReducers = [resetOnLogoutMeta];

// not-dead-code
@NgModule({
  imports: [
    EffectsModule.forFeature(quotingEffects),
    StoreModule.forFeature('quoting', quotingReducers, { metaReducers }),
  ],
})
export class QuotingStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<QuotingState>)[]) {
    return StoreModule.forFeature('quoting', pick(quotingReducers, reducers), { metaReducers });
  }
}
