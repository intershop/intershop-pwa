import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { FeatureToggleService } from '../utils/feature-toggle/feature-toggle.service';

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
