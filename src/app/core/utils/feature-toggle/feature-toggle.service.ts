/* eslint-disable ish-custom-rules/ban-imports-file-pattern */
import { Injectable, InjectionToken, Injector, ValueProvider } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { isEqual } from 'lodash-es';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { concatMap, distinctUntilChanged, map, withLatestFrom } from 'rxjs/operators';
import { Environment } from 'src/environments/environment.model';

import { getFeatures } from 'ish-core/store/core/configuration';
import { LAZY_FEATURE_MODULE, LazyModuleType } from 'ish-core/utils/module-loader/module-loader.service';
import { whenTruthy } from 'ish-core/utils/operators';

export function checkFeature(features: string[] = [], feature: string): boolean {
  if (feature === 'always') {
    return true;
  } else if (feature === 'never') {
    return false;
  } else {
    return features.includes(feature);
  }
}

export const DEFAULT_LOADED_FEATURES = new InjectionToken<string>('defaultFeature');

export function loadFeatureProvider(
  feature: Environment['features'][0] | 'always' | 'never',
  lazyLoading: false
): ValueProvider;

export function loadFeatureProvider(
  feature: Environment['features'][0] | 'always' | 'never',
  lazyLoading: true,
  lazyOptions: Omit<LazyModuleType, 'feature'>
): ValueProvider;

export function loadFeatureProvider(
  feature: Environment['features'][0] | 'always' | 'never',
  lazyLoading: boolean,
  lazyOptions?: Omit<LazyModuleType, 'feature'>
): ValueProvider {
  return lazyLoading
    ? { provide: LAZY_FEATURE_MODULE, useValue: { ...lazyOptions, feature }, multi: true }
    : { provide: DEFAULT_LOADED_FEATURES, useValue: feature, multi: true };
}

@Injectable({ providedIn: 'root' })
export class FeatureToggleService {
  private addLoadedFeature$ = new Subject<string>();
  private loadedFeatures$ = new BehaviorSubject<string[]>([]);

  private featureToggles$ = new BehaviorSubject<string[]>(undefined);

  constructor(private store: Store, private injector: Injector) {
    const defaultFeatures = this.injector.get<string[]>(DEFAULT_LOADED_FEATURES, []);

    this.store.pipe(select(getFeatures), distinctUntilChanged(isEqual)).subscribe((features: string[]) => {
      this.featureToggles$.next(features);

      // will add non lazy extensions and feature flags as default to loaded list
      defaultFeatures.forEach(defaultFeature => {
        if (checkFeature(features, defaultFeature)) {
          this.addLoadedFeatureToList(defaultFeature);
        }
      });
    });

    // will add new loaded feature to current list
    this.addLoadedFeature$.pipe(whenTruthy(), withLatestFrom(this.loadedFeatures$)).subscribe(([feature, loaded]) => {
      if (!loaded?.includes(feature)) {
        this.loadedFeatures$.next([...loaded, feature]);
      }
    });
  }

  /**
   * Synchronously check if {@param feature} is active.
   *
   * This method should only be used for browser code and only for
   * logic that is not included in the initialization process.
   */
  enabled(feature: string): boolean {
    // eslint-disable-next-line rxjs/no-subject-value
    return checkFeature(this.featureToggles$.value, feature);
  }

  /**
   * Asynchronously check if {@param feature} is active and loaded.
   */
  enabled$(feature: string): Observable<boolean> {
    return this.featureToggles$.pipe(
      map(featureToggles => checkFeature(featureToggles, feature)),
      concatMap(enabled => (enabled ? this.loaded$(feature) : of(enabled))),
      distinctUntilChanged()
    );
  }

  loaded$(feature: string): Observable<boolean> {
    if (['always', 'never'].includes(feature)) {
      return of(true);
    }
    return this.loadedFeatures$.pipe(
      map(loadedFeatures => loadedFeatures.includes(feature)),
      distinctUntilChanged()
    );
  }

  /**
   * Will add loaded lazy feature to list
   *
   * @param feature loaded lazy feature
   */
  addLoadedFeatureToList(feature: string) {
    if (['always', 'never'].includes(feature)) {
      return;
    }

    this.addLoadedFeature$.next(feature);
  }
}
