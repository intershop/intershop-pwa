import { Injectable, InjectionToken, Injector, Type } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { once } from 'lodash-es';
import { BehaviorSubject, Observable, combineLatest, noop } from 'rxjs';
import { first } from 'rxjs/operators';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { getIdentityProvider } from 'ish-core/store/core/configuration';
import { selectPath } from 'ish-core/store/core/router';
import { whenTruthy } from 'ish-core/utils/operators';

import { IdentityProvider } from './identity-provider.interface';

interface IdentityProviderImplementor {
  type: string;
  implementor: Type<IdentityProvider<unknown>>;
  feature?: string;
  activeOnPath?: string;
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

  private initialized$ = new BehaviorSubject<boolean>(false);

  constructor(private store: Store, private injector: Injector, private featureToggleService: FeatureToggleService) {
    if (!SSR) {
      combineLatest([
        this.store.pipe(select(getIdentityProvider), whenTruthy()),
        this.store.pipe(select(selectPath), whenTruthy()),
      ])
        .pipe(first())
        .subscribe(([config, path]) => {
          const availableProviders = this.injector
            .get<IdentityProviderImplementor[]>(IDENTITY_PROVIDER_IMPLEMENTOR, [])
            .filter(p => (p.feature ? this.featureToggleService.enabled(p.feature) : true));

          // select provider by
          // (1) current url path matches configured activeOnPath property from availableProviders
          // (2) selected identity provider matches type property from availableProviders
          const provider =
            availableProviders.find(p => p.activeOnPath === path) ??
            availableProviders.find(p => p.type === config?.type);

          if (!provider) {
            console.error('did not find identity provider for config', config);
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

            this.initialized$.next(true);
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

      this.initialized$.next(true);
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

  /**
   * notifies when correct identity provider is selected
   */
  getInitialized$(): Observable<boolean> {
    return this.initialized$.asObservable();
  }
}
