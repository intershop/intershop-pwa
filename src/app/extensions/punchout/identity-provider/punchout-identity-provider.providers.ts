import { Provider } from '@angular/core';

import { IDENTITY_PROVIDER_IMPLEMENTOR } from 'ish-core/identity-provider/identity-provider.factory';

import { PunchoutIdentityProvider } from './punchout-identity-provider';

export function providePunchoutIdentityProvider(): Provider[] {
  return [
    {
      provide: IDENTITY_PROVIDER_IMPLEMENTOR,
      multi: true,
      useValue: {
        type: 'PUNCHOUT',
        implementor: PunchoutIdentityProvider,
        feature: 'punchout',
      },
    },
  ];
}
