import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, InjectionToken, Injector, PLATFORM_ID, Type } from '@angular/core';
import { noop } from 'rxjs';

import { IdentityProvider } from './identity-provider.interface';

export const IDENTITY_PROVIDER_IMPLEMENTOR = new InjectionToken<{ type: string; implementor: Type<IdentityProvider> }>(
  'identityProviderImplementor'
);

@Injectable({ providedIn: 'root' })
export class IdentityProviderFactory {
  private config: { type: string };
  private instance: IdentityProvider;

  constructor(private injector: Injector, @Inject(PLATFORM_ID) private platformId: string) {}

  getInstance() {
    return this.instance;
  }

  init(config: { type: string }) {
    if (isPlatformBrowser(this.platformId)) {
      this.config = config;

      const provider = this.injector
        .get<{ type: string; implementor: Type<IdentityProvider> }[]>(IDENTITY_PROVIDER_IMPLEMENTOR, [])
        .find(p => p.type === this.config?.type);

      if (!provider) {
        console.error('did not find identity provider for config', this.config);
      } else {
        const instance = this.injector.get(provider.implementor);
        instance.init(this.config);

        this.instance = instance;
      }
    } else {
      // provide dummy instance for server side
      this.instance = {
        init: noop,
        intercept: (req, next) => next.handle(req),
        triggerLogin: () => true,
        triggerLogout: () => true,
        getCapabilities: () => ({}),
      };
    }
  }
}
