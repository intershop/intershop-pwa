import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { QuotingRoutingModule } from './quoting-routing.module';
import { quotingEffects, quotingReducers } from './store/quoting.system';

@NgModule({
  imports: [
    QuotingRoutingModule,
    StoreModule.forFeature('quoting', quotingReducers),
    EffectsModule.forFeature(quotingEffects),
  ],
})
export class QuotingModule {}
