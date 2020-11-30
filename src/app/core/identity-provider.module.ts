import { NgModule } from '@angular/core';
import { OAuthModule } from 'angular-oauth2-oidc';
import { NgModuleWithProviders } from 'ng-mocks';
import { noop } from 'rxjs';

import { Auth0IdentityProvider } from './identity-provider/auth0.identity-provider';
import { ICMIdentityProvider } from './identity-provider/icm.identity-provider';
import { IDENTITY_PROVIDER_IMPLEMENTOR, IdentityProviderFactory } from './identity-provider/identity-provider.factory';
import { IdentityProviderCapabilities } from './identity-provider/identity-provider.interface';

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
export class IdentityProviderModule {
  static forTesting(
    capabilities: IdentityProviderCapabilities = { editEmail: true, editPassword: true, editProfile: true }
  ): NgModuleWithProviders {
    return {
      ngModule: IdentityProviderModule,
      providers: [
        {
          provide: IdentityProviderFactory,
          useValue: {
            getInstance: () => ({
              init: noop,
              intercept: (req, next) => next.handle(req),
              triggerLogin: () => true,
              triggerLogout: () => true,
              getCapabilities: () => capabilities,
            }),
          },
        },
      ],
    };
  }
}
