import { Injectable, InjectionToken, Injector, Type } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { once } from 'lodash-es';
import { Observable, ReplaySubject, noop } from 'rxjs';
import { first } from 'rxjs/operators';

import { FeatureToggleService, FeatureToggleType } from 'ish-core/feature-toggle.module';
import { getIdentityProvider } from 'ish-core/store/core/configuration';
import { whenTruthy } from 'ish-core/utils/operators';

import { IdentityProvider } from './identity-provider.interface';

interface IdentityProviderImplementor {
  type: string;
  implementor: Type<IdentityProvider<unknown>>;
  feature?: FeatureToggleType;
}

export const IDENTITY_PROVIDER_IMPLEMENTOR = new InjectionToken<IdentityProviderImplementor>(
  'identityProviderImplementor'
);

@Injectable({ providedIn: 'root' })
export class IdentityProviderFactory {
  private instance: IdentityProvider<unknown>;
  // emits the identity provider instance once it is created after the configuration was loaded, undefined if none was found
  private instance$ = new ReplaySubject<IdentityProvider<unknown>>(1);
  private config: {
    [key: string]: unknown;
    type?: string;
  };

  constructor(
    private store: Store,
    private injector: Injector,
    private featureToggleService: FeatureToggleService
  ) {
    if (!SSR) {
      this.store.pipe(select(getIdentityProvider), whenTruthy(), first()).subscribe(config => {
        const provider = this.injector
          .get<IdentityProviderImplementor[]>(IDENTITY_PROVIDER_IMPLEMENTOR, [])
          .filter(p => (p.feature ? this.featureToggleService.enabled(p.feature) : true))
          .find(p => p.type === config?.type);

        if (!provider) {
          console.error('did not find identity provider for config', config);
          this.instance$.next(undefined);
        } else {
          const instance = this.injector.get(provider.implementor);

          /*
            If the code is called synchronously, the init method can call other actions that can trigger http requests.
            If an HTTP request is triggered before the identity provider constructor is finished, a "Null Pointer Exception" will be thrown in the identity-provider.interceptor.
            A delay with setTimeout is added to mitigate this problem
          */
          // TODO: Find a way to implement this without setTimeout()
          setTimeout(() => {
            instance.init(config);
          }, 1);

          this.instance = instance;
          this.config = config;
          this.instance$.next(instance);
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
      this.instance$.next(this.instance);
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

  /**
   * @returns the identity provider instance as soon as it is created
   */
  getInstance$(): Observable<IdentityProvider<unknown>> {
    return this.instance$.asObservable();
  }

  getType(): string {
    return this.config?.type;
  }
}
