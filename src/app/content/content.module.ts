import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { ContentRoutingModule } from './content-routing.module';
import { contentEffects, contentReducers } from './store/content.system';

@NgModule({
  imports: [
    ContentRoutingModule,
    StoreModule.forFeature('content', contentReducers),
    EffectsModule.forFeature(contentEffects),
  ],
})
export class ContentModule {}
