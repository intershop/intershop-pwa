import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { TactonFacade } from '../../../facades/tacton.facade';
import { TactonProductConfigurationParameter } from '../../../models/tacton-product-configuration/tacton-product-configuration.model';

@Component({
  selector: 'ish-tacton-select-input',
  templateUrl: './tacton-select-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TactonSelectInputComponent {
  @Input() parameter: TactonProductConfigurationParameter;

  constructor(private facade: TactonFacade) {}

  change(value) {
    this.facade.commitValue(this.parameter, value);
  }

  selectedValue() {
    return this.parameter?.domain.elements.find(el => el.selected).name;
  }
}
