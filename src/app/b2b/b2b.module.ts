import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { QuoteService } from './services/quote/quote.service';
import { b2bEffects, b2bReducers } from './store/b2b.system';

@NgModule({
  imports: [StoreModule.forFeature('b2b', b2bReducers), EffectsModule.forFeature(b2bEffects)],
  providers: [QuoteService],
})
export class B2bModule {}
