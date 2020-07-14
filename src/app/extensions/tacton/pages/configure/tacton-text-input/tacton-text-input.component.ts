import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { TactonFacade } from '../../../facades/tacton.facade';
import { TactonProductConfigurationParameter } from '../../../models/tacton-product-configuration/tacton-product-configuration.model';

@Component({
  selector: 'ish-tacton-text-input',
  templateUrl: './tacton-text-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TactonTextInputComponent {
  @Input() parameter: TactonProductConfigurationParameter;

  constructor(private facade: TactonFacade) {}

  change(value) {
    this.facade.commitValue(this.parameter, value);
  }
}
