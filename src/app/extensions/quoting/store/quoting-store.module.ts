import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

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

// not-dead-code
@NgModule({
  imports: [EffectsModule.forFeature(quotingEffects), StoreModule.forFeature('quoting', quotingReducers)],
})
export class QuotingStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<QuotingState>)[]) {
    return StoreModule.forFeature('quoting', pick(quotingReducers, reducers));
  }
}
