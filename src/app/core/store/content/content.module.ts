import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { contentEffects, contentReducers } from './content.system';

@NgModule({
  imports: [EffectsModule.forFeature(contentEffects), StoreModule.forFeature('content', contentReducers)],
})
export class ContentModule {}
