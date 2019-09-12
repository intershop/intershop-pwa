import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { FeatureToggleService } from 'ish-core/utils/feature-toggle/feature-toggle.service';

/**
 * Structural directive.
 * Used on an element, this element will only be rendered if the specified feature *is not enabled*.
 *
 * For the negated case see {@link FeatureToggleDirective}.
 *
 * @example
 * <div *ishNotFeature="'quoting'">
 *   Only visible when quoting is NOT enabled by configuration.
 * </div>
 */
@Directive({
  selector: '[ishNotFeature]',
})
export class NotFeatureToggleDirective {
  constructor(
    // tslint:disable-next-line:no-any
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private featureToggle: FeatureToggleService
  ) {}

  @Input() set ishNotFeature(val) {
    const enabled = !this.featureToggle.enabled(val);

    if (enabled) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
