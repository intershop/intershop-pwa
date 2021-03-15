import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, InjectionToken, Injector, PLATFORM_ID, Type } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { noop } from 'rxjs';
import { first } from 'rxjs/operators';

import { getIdentityProvider } from 'ish-core/store/core/configuration';
import { whenTruthy } from 'ish-core/utils/operators';

import { IdentityProvider } from './identity-provider.interface';

export const IDENTITY_PROVIDER_IMPLEMENTOR = new InjectionToken<{
  type: string;
  implementor: Type<IdentityProvider<unknown>>;
}>('identityProviderImplementor');

@Injectable({ providedIn: 'root' })
export class IdentityProviderFactory {
  private instance: IdentityProvider<unknown>;
  private config: {
    [key: string]: unknown;
    type?: string;
  };

  constructor(private store: Store, private injector: Injector, @Inject(PLATFORM_ID) platformId: string) {
    if (isPlatformBrowser(platformId)) {
      this.store.pipe(select(getIdentityProvider), whenTruthy(), first()).subscribe(config => {
        const provider = this.injector
          .get<{ type: string; implementor: Type<IdentityProvider<unknown>> }[]>(IDENTITY_PROVIDER_IMPLEMENTOR, [])
          .find(p => p.type === config?.type);

        if (!provider) {
          console.error('did not find identity provider for config', config);
        } else {
          const instance = this.injector.get(provider.implementor);
          instance.init(config);

          this.instance = instance;
          this.config = config;
        }
      });
    } else {
      this.instance = {
        init: noop,
        intercept: (req, next) => next.handle(req),
        triggerLogin: () => true,
        triggerLogout: () => true,
        getCapabilities: () => ({}),
      };
    }
  }

  getInstance() {
    return this.instance;
  }

  getType(): string {
    return this.config?.type;
  }
}
