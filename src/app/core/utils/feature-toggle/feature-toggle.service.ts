import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getFeatures } from 'ish-core/store/configuration';

@Injectable({ providedIn: 'root' })
export class FeatureToggleService {
  private featureToggles: string[];

  constructor(store: Store<{}>) {
    store.pipe(select(getFeatures)).subscribe(features => (this.featureToggles = features));
  }

  enabled(feature: string): boolean {
    return this.featureToggles.includes(feature);
  }
}
