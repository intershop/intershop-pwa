import { ActionReducerMap } from '@ngrx/store';
import { B2bState } from './b2b.state';
import { QuoteEffects } from './quote/quote.effects';
import { quoteReducer } from './quote/quote.reducer';

export const b2bReducers: ActionReducerMap<B2bState> = {
  quote: quoteReducer,
};

export const b2bEffects = [QuoteEffects];
