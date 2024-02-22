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
import { takeUntil } from 'rxjs';

import { getFeatures } from 'ish-core/store/core/configuration';
import { FeatureToggleService, FeatureToggleType } from 'ish-core/utils/feature-toggle/feature-toggle.service';
import { whenTruthy } from 'ish-core/utils/operators';

declare interface LazyModuleType {
  feature: FeatureToggleType;
  location(): Promise<Type<unknown>>;
}

export const LAZY_FEATURE_MODULE = new InjectionToken<LazyModuleType>('lazyModule');

@Injectable({ providedIn: 'root' })
export class ModuleLoaderService {
  private loadedModules: Type<unknown>[] = [];

  private destroyRef = inject(DestroyRef);

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
        takeUntilDestroyed(this.destroyRef)
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
}
