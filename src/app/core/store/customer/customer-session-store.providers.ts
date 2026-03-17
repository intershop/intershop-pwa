import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';

import { AuthorizationEffects } from './authorization/authorization.effects';
import { UserEffects } from './user/user.effects';

const customerSessionEffects = [UserEffects, AuthorizationEffects];

export function provideCustomerSessionStore(): EnvironmentProviders {
  return makeEnvironmentProviders([provideEffects(customerSessionEffects)]);
}

export class CustomerSessionStoreProviders {}
