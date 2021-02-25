import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { TactonFacade } from '../../../facades/tacton.facade';
import { TactonProductConfigurationParameter } from '../../../models/tacton-product-configuration/tacton-product-configuration.model';

// tslint:disable-next-line: use-component-change-detection
@Component({ template: '' })
// tslint:disable-next-line: component-creation-test
export abstract class TactonConfigParameterComponent {
  @Input() parameter: TactonProductConfigurationParameter;

  constructor(protected facade: TactonFacade) {}

  change(value: string | EventTarget) {
    this.facade.commitValue(this.parameter, typeof value === 'string' ? value : (value as HTMLDataElement).value);
  }

  getImageUrl(picture: string): Observable<string> {
    return this.facade.getImageUrl$(picture);
  }
}
