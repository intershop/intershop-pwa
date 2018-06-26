import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { B2bRoutingModule } from './b2b-routing.module';
import { QuoteRequestService } from './services/quote-request/quote-request.service';
import { QuoteService } from './services/quote/quote.service';
import { b2bEffects, b2bReducers } from './store/b2b.system';

@NgModule({
  imports: [B2bRoutingModule, StoreModule.forFeature('b2b', b2bReducers), EffectsModule.forFeature(b2bEffects)],
  providers: [QuoteService, QuoteRequestService],
})
export class B2bModule {}
