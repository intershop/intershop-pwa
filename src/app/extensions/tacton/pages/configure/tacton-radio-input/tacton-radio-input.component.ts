import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { TactonFacade } from '../../../facades/tacton.facade';
import { TactonProductConfigurationParameter } from '../../../models/tacton-product-configuration/tacton-product-configuration.model';

@Component({
  selector: 'ish-tacton-radio-input',
  templateUrl: './tacton-radio-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TactonRadioInputComponent {
  @Input() parameter: TactonProductConfigurationParameter;

  constructor(private facade: TactonFacade) {}

  change(value) {
    this.facade.commitValue(this.parameter, value);
  }
}
