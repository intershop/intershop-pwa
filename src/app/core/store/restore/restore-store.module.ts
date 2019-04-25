import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { RestoreEffects } from './restore.effects';

@NgModule({
  imports: [EffectsModule.forFeature([RestoreEffects])],
})
export class RestoreStoreModule {}
