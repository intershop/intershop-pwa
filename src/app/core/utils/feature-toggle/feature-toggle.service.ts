import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import type { Environment } from 'src/environments/environment.model';

import { getFeatures } from 'ish-core/store/core/configuration';

export type FeatureToggleType = Environment['features'][number];

export function checkFeature(
  features: FeatureToggleType[] = [],
  feature: 'always' | 'never' | FeatureToggleType
): boolean {
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
  private featureToggles$ = new BehaviorSubject<FeatureToggleType[]>(undefined);

  constructor(store: Store) {
    store.pipe(select(getFeatures)).subscribe(this.featureToggles$);
  }

  /**
   * Synchronously check if {@param feature} is active.
   *
   * This method should only be used for browser code and only for
   * logic that is not included in the initialization process.
   */
  enabled(feature: 'always' | 'never' | FeatureToggleType): boolean {
    // eslint-disable-next-line rxjs/no-subject-value
    return checkFeature(this.featureToggles$.value, feature);
  }

  /**
   * Asynchronously check if {@param feature} is active.
   */
  enabled$(feature: 'always' | 'never' | FeatureToggleType): Observable<boolean> {
    return this.featureToggles$.pipe(
      map(featureToggles => checkFeature(featureToggles, feature)),
      distinctUntilChanged()
    );
  }
}
