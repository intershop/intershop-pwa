import { NgModule } from '@angular/core';
import { OAuthModule } from 'angular-oauth2-oidc';

import { Auth0IdentityProvider } from './identity-provider/auth0.identity-provider';
import { ICMIdentityProvider } from './identity-provider/icm.identity-provider';
import { IDENTITY_PROVIDER_IMPLEMENTOR } from './identity-provider/identity-provider.factory';

@NgModule({
  imports: [OAuthModule.forRoot({ resourceServer: { sendAccessToken: false } })],
  providers: [
    {
      provide: IDENTITY_PROVIDER_IMPLEMENTOR,
      multi: true,
      useValue: {
        type: 'ICM',
        implementor: ICMIdentityProvider,
      },
    },
    {
      provide: IDENTITY_PROVIDER_IMPLEMENTOR,
      multi: true,
      useValue: {
        type: 'auth0',
        implementor: Auth0IdentityProvider,
      },
    },
  ],
})
export class IdentityProviderModule {}
