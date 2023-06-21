import { Injector } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

export class InstanceCreators {
  static getOAuthServiceInstance(parent: Injector): OAuthService {
    const injector = Injector.create({ providers: [{ provide: OAuthService }], parent });
    return injector.get(OAuthService);
  }
}
