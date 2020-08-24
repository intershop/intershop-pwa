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
  // tslint:disable-next-line: no-any
  private otherTemplateRef: TemplateRef<any>;
  private feature: string;

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private featureToggle: FeatureToggleService
  ) {}

  @Input() set ishFeature(feature: string) {
    this.feature = feature;
    this.updateView();
  }

  // tslint:disable-next-line: no-any
  @Input() set ishFeatureElse(otherTemplateRef: TemplateRef<any>) {
    this.otherTemplateRef = otherTemplateRef;
    this.updateView();
  }

  private updateView() {
    const enabled = this.featureToggle.enabled(this.feature);

    this.viewContainer.clear();
    if (enabled) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else if (this.otherTemplateRef) {
      this.viewContainer.createEmbeddedView(this.otherTemplateRef);
    }
  }
}
