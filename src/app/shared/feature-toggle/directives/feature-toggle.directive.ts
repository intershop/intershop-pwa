import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { FeatureToggleService } from '../services/feature-toggle.service';

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

  @Input()
  set ishFeature(val) {
    const enabled = this.featureToggle.enabled(val);

    if (enabled) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
