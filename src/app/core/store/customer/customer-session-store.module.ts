import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { AuthorizationEffects } from './authorization/authorization.effects';
import { UserEffects } from './user/user.effects';

@NgModule({
  imports: [EffectsModule.forFeature([UserEffects, AuthorizationEffects])],
})
export class CustomerSessionStoreModule {}
