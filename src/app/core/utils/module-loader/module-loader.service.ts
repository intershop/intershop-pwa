import {
  ApplicationRef,
  DestroyRef,
  Injectable,
  InjectionToken,
  Injector,
  Type,
  createNgModule,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store, select } from '@ngrx/store';
import { combineLatest, take, takeUntil } from 'rxjs';

import { FeatureToggleService, FeatureToggleType } from 'ish-core/feature-toggle.module';
import { getFeatures } from 'ish-core/store/core/configuration';
import { whenTruthy } from 'ish-core/utils/operators';

declare interface LazyModuleType {
  feature: FeatureToggleType;
  location(): Promise<Type<unknown>>;
}

export const LAZY_FEATURE_MODULE = new InjectionToken<LazyModuleType>('lazyModule');

@Injectable({ providedIn: 'root' })
export class ModuleLoaderService {
  private readonly onDemandBrowserFeatures = new Set<FeatureToggleType>([
    'compare',
    'orderTemplates',
    'productNotifications',
    'quoting',
    'rating',
    'wishlists',
  ]);

  private loadedModules: Type<unknown>[] = [];
  private loadingFeatures = new Map<FeatureToggleType, Promise<void>>();
  private loadedFeatures = new Set<FeatureToggleType>();
  private initializedInjectors = new WeakSet<Injector>();

  private destroyRef = inject(DestroyRef);

  constructor(
    private featureToggleService: FeatureToggleService,
    private store: Store,
    private appRef: ApplicationRef
  ) {}

  init(injector: Injector) {
    if (this.initializedInjectors.has(injector)) {
      return;
    }
    this.initializedInjectors.add(injector);

    if (SSR) {
      this.initSsr(injector);
      return;
    }

    combineLatest([
      this.store.pipe(select(getFeatures), whenTruthy()),
      this.appRef.isStable.pipe(whenTruthy(), take(1)),
    ])
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.scheduleAfterInitialStability(() => this.loadEnabledModules(injector, { skipOnDemandFeatures: true }));
      });
  }

  async loadFeature(feature: FeatureToggleType, injector: Injector) {
    if (this.loadedFeatures.has(feature)) {
      return;
    }

    const loadingFeature = this.loadingFeatures.get(feature);
    if (loadingFeature) {
      await loadingFeature;
      return;
    }

    const lazyModule = injector.get<LazyModuleType[]>(LAZY_FEATURE_MODULE, []).find(mod => mod.feature === feature);

    if (lazyModule && this.shouldLoad(lazyModule)) {
      await this.loadModule(lazyModule, injector);
    }
  }

  private initSsr(injector: Injector) {
    this.store
      .pipe(
        select(getFeatures),
        whenTruthy(),
        takeUntil(this.appRef.isStable.pipe(whenTruthy())),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.loadEnabledModules(injector);
      });
  }

  private scheduleAfterInitialStability(callback: () => void) {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(callback, { timeout: 2000 });
    } else {
      setTimeout(callback);
    }
  }

  private loadEnabledModules(injector: Injector, options: { skipOnDemandFeatures?: boolean } = {}) {
    const lazyModules = injector.get<LazyModuleType[]>(LAZY_FEATURE_MODULE, []);
    lazyModules
      .filter(mod => this.shouldLoad(mod))
      .filter(mod => !options.skipOnDemandFeatures || !this.onDemandBrowserFeatures.has(mod.feature))
      .forEach(mod => void this.loadModule(mod, injector));
  }

  private shouldLoad(mod: LazyModuleType) {
    return (
      this.featureToggleService.enabled(mod.feature) &&
      !this.loadedFeatures.has(mod.feature) &&
      !this.loadingFeatures.has(mod.feature)
    );
  }

  private async loadModule(mod: LazyModuleType, injector: Injector) {
    const loadingFeature = (async () => {
      const loaded = await mod.location();
      if (!this.loadedModules.includes(loaded)) {
        createNgModule(loaded, injector);
        this.loadedModules.push(loaded);
      }
      this.loadedFeatures.add(mod.feature);
    })();

    this.loadingFeatures.set(mod.feature, loadingFeature);
    try {
      await loadingFeature;
    } finally {
      this.loadingFeatures.delete(mod.feature);
    }
  }
}
