import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { TactonFacade } from '../../../facades/tacton.facade';
import { TactonProductConfigurationParameter } from '../../../models/tacton-product-configuration/tacton-product-configuration.model';

// eslint-disable-next-line ish-custom-rules/use-component-change-detection
@Component({ template: '' })
export abstract class TactonConfigParameterComponent {
  @Input({ required: true }) parameter: TactonProductConfigurationParameter;

  constructor(protected facade: TactonFacade) {}

  change(value: string | EventTarget) {
    this.facade.commitValue(this.parameter, typeof value === 'string' ? value : (value as HTMLDataElement).value);
  }

  getImageUrl(picture: string): Observable<string> {
    return this.facade.getImageUrl$(picture);
  }
}
