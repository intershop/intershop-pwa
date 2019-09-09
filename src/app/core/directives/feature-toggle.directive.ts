import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { FeatureToggleService } from 'ish-core/utils/feature-toggle/feature-toggle.service';

/**
 * Structural directive.
 * Used on an element, this element will only be rendered if the specified feature *is enabled*.
 *
 * For the negated case see {@link NotFeatureToggleDirective}.
 *
 * @example
 * <div *ishFeature="'quoting'">
 *   Only visible when quoting is enabled by configuration.
 * </div>
 */
@Directive({
  selector: '[ishFeature]',
})
export class FeatureToggleDirective {
  constructor(
    // tslint:disable-next-line:no-any
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private featureToggle: FeatureToggleService
  ) {}

  @Input() set ishFeature(val) {
    const enabled = this.featureToggle.enabled(val);

    if (enabled) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
