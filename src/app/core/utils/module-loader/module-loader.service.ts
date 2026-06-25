import {
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
import { Observable, defer, from, take } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { FeatureToggleService, FeatureToggleType } from 'ish-core/feature-toggle';
import { getFeatures } from 'ish-core/store/core/configuration';
import { whenTruthy } from 'ish-core/utils/operators';

export interface LazyFeatureProviderType {
  feature: 'always' | FeatureToggleType;
  loadStrategy?: 'appInit' | 'onDemand';
  providers(): Promise<(EnvironmentProviders | Provider)[] | EnvironmentProviders>;
}

export const LAZY_FEATURE_PROVIDER = new InjectionToken<LazyFeatureProviderType>('lazyFeatureProvider');
export const LAZY_FEATURE_MODULE = new InjectionToken<LazyFeatureProviderType>('lazyFeatureModule');

@Injectable({ providedIn: 'root' })
export class ModuleLoaderService {
  private loadedFeatures = new Map<'always' | FeatureToggleType, Promise<void>>();
  private loadedInjectors: EnvironmentInjector[] = [];

  private destroyRef = inject(DestroyRef);
  private environmentInjector = inject(EnvironmentInjector);

  constructor(
    private featureToggleService: FeatureToggleService,
    private store: Store
  ) {}

  init() {
    this.store.pipe(select(getFeatures), whenTruthy(), take(1), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.getLazyFeatures()
        .filter(feature => feature.loadStrategy !== 'onDemand')
        .forEach(feature => void this.ensureLoaded(feature.feature));
    });
  }

  ensureLoaded(feature: 'always' | FeatureToggleType): Promise<void> {
    const existingPromise = this.loadedFeatures.get(feature);
    if (existingPromise) {
      return existingPromise;
    }

    const matchingFeatures = this.getLazyFeatures().filter(entry => entry.feature === feature);
    if (!matchingFeatures.length || (feature !== 'always' && !this.featureToggleService.enabled(feature))) {
      return Promise.resolve();
    }

    const loadPromise = Promise.all(matchingFeatures.map(entry => this.loadFeature(entry))).then(() => undefined);
    this.loadedFeatures.set(feature, loadPromise);

    return loadPromise;
  }

  whenLoaded<T>(feature: 'always' | FeatureToggleType, sourceFactory: () => Observable<T>): Observable<T> {
    return defer(() => from(this.ensureLoaded(feature)).pipe(switchMap(() => sourceFactory())));
  }

  private getLazyFeatures() {
    return [
      ...this.environmentInjector.get<LazyFeatureProviderType[]>(LAZY_FEATURE_PROVIDER, []),
      ...this.environmentInjector.get<LazyFeatureProviderType[]>(LAZY_FEATURE_MODULE, []),
    ];
  }

  private async loadFeature(feature: LazyFeatureProviderType) {
    const providers = await feature.providers();
    const environmentInjector = createEnvironmentInjector(
      Array.isArray(providers) ? providers : [providers],
      this.environmentInjector
    );
    this.loadedInjectors.push(environmentInjector);
  }
}
