import { Pipe, PipeTransform } from '@angular/core';

import { FeatureToggleService } from 'ish-core/utils/feature-toggle/feature-toggle.service';

@Pipe({ name: 'ishFeature', pure: true })
export class FeatureTogglePipe implements PipeTransform {
  constructor(private featureToggleService: FeatureToggleService) {}

  transform(feature: string): boolean {
    return this.featureToggleService.enabled(feature);
  }
}
