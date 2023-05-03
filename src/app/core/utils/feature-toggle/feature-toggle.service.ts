import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { isEqual } from 'lodash-es';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { concatMap, distinctUntilChanged, map } from 'rxjs/operators';

import { getFeatures, isLazyFeatureLoaded } from 'ish-core/store/core/configuration';

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
  private featureToggles$ = new BehaviorSubject<string[]>(undefined);

  constructor(private store: Store) {
    this.store.pipe(select(getFeatures), distinctUntilChanged(isEqual)).subscribe(this.featureToggles$);
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
    return this.store.pipe(select(isLazyFeatureLoaded(feature))).pipe(distinctUntilChanged());
  }
}
