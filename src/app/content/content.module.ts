import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { ContentRoutingModule } from './content-routing.module';
import { contentEffects, contentReducers } from './store/content.system';

@NgModule({
  imports: [
    ContentRoutingModule,
    EffectsModule.forFeature(contentEffects),
    StoreModule.forFeature('content', contentReducers),
  ],
})
export class ContentModule {}
