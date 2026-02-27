import {
  ApplicationRef,
  DestroyRef,
  EnvironmentInjector,
  EnvironmentProviders,
  Injectable,
  InjectionToken,
  Provider,
  createEnvironmentInjector,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store, select } from '@ngrx/store';
import { takeUntil } from 'rxjs';

import { FeatureToggleService, FeatureToggleType } from 'ish-core/feature-toggle.module';
import { getFeatures } from 'ish-core/store/core/configuration';
import { whenTruthy } from 'ish-core/utils/operators';

export interface LazyFeatureProviderType {
  feature: FeatureToggleType;
  providers(): Promise<EnvironmentProviders | (Provider | EnvironmentProviders)[]>;
}

export const LAZY_FEATURE_PROVIDER = new InjectionToken<LazyFeatureProviderType>('lazyFeatureProvider');

// TODO: remove alias after all feature registrations switched to LAZY_FEATURE_PROVIDER.
export const LAZY_FEATURE_MODULE = LAZY_FEATURE_PROVIDER;

@Injectable({ providedIn: 'root' })
export class ModuleLoaderService {
  private loadedFeatures: LazyFeatureProviderType[] = [];
  private loadedInjectors: EnvironmentInjector[] = [];

  private destroyRef = inject(DestroyRef);

  constructor(
    private featureToggleService: FeatureToggleService,
    private store: Store,
    private appRef: ApplicationRef
  ) {}

  init(injector: EnvironmentInjector) {
    this.store
      .pipe(
        select(getFeatures),
        whenTruthy(),
        takeUntil(this.appRef.isStable.pipe(whenTruthy())),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        const lazyFeatures = injector.get<LazyFeatureProviderType[]>(LAZY_FEATURE_PROVIDER, []);
        lazyFeatures
          .filter(feature => this.featureToggleService.enabled(feature.feature))
          .forEach(async feature => {
            if (!this.loadedFeatures.includes(feature)) {
              const providers = await feature.providers();
              const environmentInjector = createEnvironmentInjector(
                Array.isArray(providers) ? providers : [providers],
                injector
              );
              this.loadedFeatures.push(feature);
              this.loadedInjectors.push(environmentInjector);
            }
          });
      });
  }
}
