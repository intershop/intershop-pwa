import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { getFeatures } from 'ish-core/store/core/configuration';

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

  constructor(store: Store) {
    store.pipe(select(getFeatures)).subscribe(this.featureToggles$);
  }

  enabled(feature: string): boolean {
    // tslint:disable-next-line: rxjs-no-subject-value
    return checkFeature(this.featureToggles$.value, feature);
  }

  enabled$(feature: string): Observable<boolean> {
    return this.featureToggles$.pipe(map(featureToggles => checkFeature(featureToggles, feature)));
  }
}
