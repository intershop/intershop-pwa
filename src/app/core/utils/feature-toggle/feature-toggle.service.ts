import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { isEqual } from 'lodash-es';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { concatMap, distinctUntilChanged, map, withLatestFrom } from 'rxjs/operators';

import { getFeatures } from 'ish-core/store/core/configuration';
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

@Injectable({ providedIn: 'root' })
export class FeatureToggleService {
  private addLoadedFeature$ = new Subject<string>();
  private lazyFeaturesLoaded$ = new BehaviorSubject<string[]>([]);

  private featureToggles$ = new BehaviorSubject<string[]>(undefined);

  constructor(private store: Store) {
    this.store.pipe(select(getFeatures), distinctUntilChanged(isEqual)).subscribe(this.featureToggles$);

    // will add new loaded feature to current list
    this.addLoadedFeature$
      .pipe(whenTruthy(), withLatestFrom(this.lazyFeaturesLoaded$))
      .subscribe(([feature, loaded]) => this.lazyFeaturesLoaded$.next([...loaded, feature]));
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
    return this.lazyFeaturesLoaded$.pipe(
      map(loadedFeatures => loadedFeatures.includes(feature)),
      distinctUntilChanged()
    );
  }

  addLazyFeatureLoaded(feature: string) {
    if (['always', 'never'].includes(feature)) {
      return;
    }

    this.addLoadedFeature$.next(feature);
  }
}
