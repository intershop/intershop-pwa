import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { getFeatures } from 'ish-core/store/core/configuration';
import { whenTruthy } from 'ish-core/utils/operators';

export function checkFeature(features: string[], feature: string): boolean {
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
  private featureToggles$: Observable<string[]>;

  constructor(store: Store) {
    this.featureToggles$ = store.pipe(select(getFeatures)).pipe(map(features => features || []));
  }

  enabled(feature: string): Observable<boolean> {
    return this.featureToggles$.pipe(
      whenTruthy(),
      map(featureToggles => checkFeature(featureToggles, feature))
    );
  }
}
