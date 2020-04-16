import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { SeoEffects } from './seo/seo.effects';

const seoEffects = [SeoEffects];

@NgModule({
  imports: [EffectsModule.forFeature(seoEffects)],
})
export class SeoStoreModule {}
