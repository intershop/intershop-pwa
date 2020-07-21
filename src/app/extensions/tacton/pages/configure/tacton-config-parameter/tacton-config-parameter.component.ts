import { Component, Input } from '@angular/core';

import { TactonFacade } from '../../../facades/tacton.facade';
import { TactonProductConfigurationParameter } from '../../../models/tacton-product-configuration/tacton-product-configuration.model';

// tslint:disable-next-line: use-component-change-detection
@Component({ template: '' })
// tslint:disable-next-line: component-creation-test
export abstract class TactonConfigParameterComponent {
  @Input() parameter: TactonProductConfigurationParameter;

  constructor(protected facade: TactonFacade) {}

  change(value) {
    this.facade.commitValue(this.parameter, value);
  }

  uncommit() {
    this.facade.uncommitValue(this.parameter);
  }
}
