import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, ReducerManager, Store, combineReducers } from '@ngrx/store';
import { take } from 'rxjs/operators';

import { QuoteRequestEffects } from './quote-request/quote-request.effects';
import { quoteRequestReducer } from './quote-request/quote-request.reducer';
import { QuoteEffects } from './quote/quote.effects';
import { quoteReducer } from './quote/quote.reducer';
import { QuotingState } from './quoting-store';

export const quotingReducers: ActionReducerMap<QuotingState> = {
  quote: quoteReducer,
  quoteRequest: quoteRequestReducer,
};

export const quotingEffects = [QuoteEffects, QuoteRequestEffects];

const quotingFeature = 'quoting';

@NgModule({
  imports: [EffectsModule.forFeature(quotingEffects)],
})
export class QuotingStoreModule {
  constructor(manager: ReducerManager, store: Store<{}>) {
    store.pipe(take(1)).subscribe(x => {
      if (!x[quotingFeature]) {
        manager.addReducers({ [quotingFeature]: combineReducers(quotingReducers) });
      }
    });
  }
}
