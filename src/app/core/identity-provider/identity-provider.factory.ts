import { Injectable, InjectionToken, Injector, Type } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { once } from 'lodash-es';
import { noop } from 'rxjs';
import { first } from 'rxjs/operators';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { getIdentityProvider } from 'ish-core/store/core/configuration';
import { whenTruthy } from 'ish-core/utils/operators';

import { IdentityProvider } from './identity-provider.interface';

interface IdentityProviderImplementor {
  type: string;
  implementor: Type<IdentityProvider<unknown>>;
  feature?: string;
}

export const IDENTITY_PROVIDER_IMPLEMENTOR = new InjectionToken<IdentityProviderImplementor>(
  'identityProviderImplementor'
);

@Injectable({ providedIn: 'root' })
export class IdentityProviderFactory {
  private instance: IdentityProvider<unknown>;
  private config: {
    [key: string]: unknown;
    type?: string;
  };

  constructor(private store: Store, private injector: Injector, private featureToggleService: FeatureToggleService) {
    if (!SSR) {
      this.store.pipe(select(getIdentityProvider), whenTruthy(), first()).subscribe(config => {
        const provider = this.injector
          .get<IdentityProviderImplementor[]>(IDENTITY_PROVIDER_IMPLEMENTOR, [])
          .filter(p => (p.feature ? this.featureToggleService.enabled(p.feature) : true))
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
        triggerInvite: () => true,
        getCapabilities: () => ({}),
      };
    }
  }

  private logNoIdpError = once(() =>
    console.error('No identity provider instance exists. Please double-check your configuration:', this.config)
  );

  getInstance() {
    if (!this.instance) {
      this.logNoIdpError();
    }
    return this.instance;
  }

  getType(): string {
    return this.config?.type;
  }
}
