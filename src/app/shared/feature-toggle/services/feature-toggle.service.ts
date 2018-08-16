import { Inject, Injectable } from '@angular/core';

import { FEATURE_TOGGLES } from '../configurations/injection-keys';

@Injectable()
export class FeatureToggleService {
  constructor(@Inject(FEATURE_TOGGLES) private featureToggles) {}

  enabled(feature: string): boolean {
    return (
      this.featureToggles === undefined || this.featureToggles[feature] === undefined || !!this.featureToggles[feature]
    );
  }
}
