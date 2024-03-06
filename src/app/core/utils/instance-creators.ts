import { Injector } from '@angular/core';
import { OAuthService, OAuthStorage } from 'angular-oauth2-oidc';

export class InstanceCreators {
  static getOAuthServiceInstance(parent: Injector, storageFactory?: () => OAuthStorage): OAuthService {
    const injector = Injector.create({
      providers: [
        ...(storageFactory ? [{ provide: OAuthStorage, useFactory: storageFactory }] : []),
        { provide: OAuthService },
      ],
      parent,
    });
    return injector.get(OAuthService);
  }
}
