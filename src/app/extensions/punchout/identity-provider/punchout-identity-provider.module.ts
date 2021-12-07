import { NgModule } from '@angular/core';

import { IDENTITY_PROVIDER_IMPLEMENTOR } from 'ish-core/identity-provider/identity-provider.factory';

import { PunchoutIdentityProvider } from './punchout-identity-provider';

@NgModule({
  providers: [
    {
      provide: IDENTITY_PROVIDER_IMPLEMENTOR,
      multi: true,
      useValue: {
        type: 'PUNCHOUT',
        implementor: PunchoutIdentityProvider,
        feature: 'punchout',
      },
    },
  ],
})
export class PunchoutIdentityProviderModule {}
