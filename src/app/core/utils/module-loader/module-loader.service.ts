import { ApplicationRef, Injectable, InjectionToken, Injector, OnDestroy, Type, createNgModule } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';

import { getFeatures } from 'ish-core/store/core/configuration';
import { FeatureToggleService } from 'ish-core/utils/feature-toggle/feature-toggle.service';
import { whenTruthy } from 'ish-core/utils/operators';

declare interface LazyModuleType {
  feature: string;
  location(): Promise<Type<unknown>>;
}

export const LAZY_FEATURE_MODULE = new InjectionToken<LazyModuleType>('lazyModule');

@Injectable({ providedIn: 'root' })
export class ModuleLoaderService implements OnDestroy {
  private loadedModules: Type<unknown>[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private featureToggleService: FeatureToggleService,
    private store: Store,
    private appRef: ApplicationRef
  ) {}

  init(injector: Injector) {
    this.store
      .pipe(
        select(getFeatures),
        whenTruthy(),
        takeUntil(this.appRef.isStable.pipe(whenTruthy())),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        const lazyModules = injector.get<LazyModuleType[]>(LAZY_FEATURE_MODULE, []);
        lazyModules
          .filter(mod => this.featureToggleService.enabled(mod.feature))
          .forEach(async mod => {
            const loaded = await mod.location();
            if (!this.loadedModules.includes(loaded)) {
              createNgModule(loaded, injector);
              this.loadedModules.push(loaded);
            }
          });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
