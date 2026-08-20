import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { GeoEffects } from './geo/geo.effects';

const geoEffects = [GeoEffects];

@NgModule({
  imports: [EffectsModule.forFeature(geoEffects)],
})
export class GeoStoreModule {}
