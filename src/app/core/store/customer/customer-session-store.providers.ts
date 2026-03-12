import { EnvironmentProviders, importProvidersFrom, makeEnvironmentProviders } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { AuthorizationEffects } from './authorization/authorization.effects';
import { UserEffects } from './user/user.effects';

const customerSessionStoreImports = [EffectsModule.forFeature([UserEffects, AuthorizationEffects])];

export function provideCustomerSessionStore(): EnvironmentProviders {
  return makeEnvironmentProviders([importProvidersFrom(...customerSessionStoreImports)]);
}

export class CustomerSessionStoreModule {}
