import { Compiler, Injectable, InjectionToken, Injector, NgModuleFactory } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getFeatures } from 'ish-core/store/core/configuration';
import { FeatureToggleService } from 'ish-core/utils/feature-toggle/feature-toggle.service';
import { whenTruthy } from 'ish-core/utils/operators';

declare interface LazyModuleType {
  feature: string;
  location(): unknown;
}

export const LAZY_FEATURE_MODULE = new InjectionToken<LazyModuleType>('lazyModule');

@Injectable({ providedIn: 'root' })
export class ModuleLoaderService {
  private loadedModules: string[] = [];

  constructor(private compiler: Compiler, private featureToggleService: FeatureToggleService, private store: Store) {}

  init(injector: Injector) {
    this.store.pipe(select(getFeatures), whenTruthy()).subscribe(() => {
      const lazyModules = injector.get<LazyModuleType[]>(LAZY_FEATURE_MODULE, []);
      lazyModules
        .filter(mod => !this.loadedModules.includes(mod.feature))
        .filter(mod => this.featureToggleService.enabled(mod.feature))
        .forEach(async mod => {
          await this.loadModule(mod.location(), injector);
          this.loadedModules.push(mod.feature);
        });
    });
  }

  private async loadModule(loc, injector: Injector) {
    const loaded = await loc;
    Object.keys(loaded)
      .filter(key => key.endsWith('Module'))
      .forEach(async key => {
        const moduleFactory = await this.loadModuleFactory(loaded[key]);
        moduleFactory.create(injector);
      });
  }

  private async loadModuleFactory(t) {
    if (t instanceof NgModuleFactory) {
      return t;
    } else {
      return await this.compiler.compileModuleAsync(t);
    }
  }
}
