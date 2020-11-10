import { Pipe, PipeTransform } from '@angular/core';

import { FeatureToggleService } from 'ish-core/utils/feature-toggle/feature-toggle.service';

/**
 * Pipe
 *
 * Used on a string, this pipe will only return true if the specified feature *is enabled*.
 * For the corresponding directive, see {@link FeatureToggleDirective}.
 *
 * @example
 * <ish-product-add-to-compare *ngIf="'compare' | ishFeature"> ...</ish-product-add-to-compare>
 */
@Pipe({ name: 'ishFeature', pure: true })
export class FeatureTogglePipe implements PipeTransform {
  constructor(private featureToggleService: FeatureToggleService) {}

  transform(feature: string): boolean {
    return this.featureToggleService.enabled(feature);
  }
}
