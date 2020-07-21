import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TactonFacade } from '../../../facades/tacton.facade';
import { TactonConfigParameterComponent } from '../tacton-config-parameter/tacton-config-parameter.component';

@Component({
  selector: 'ish-tacton-select-input',
  templateUrl: './tacton-select-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TactonSelectInputComponent extends TactonConfigParameterComponent {
  constructor(protected facade: TactonFacade) {
    super(facade);
  }

  selectedValue() {
    return this.parameter?.domain.elements.find(el => el.selected).name;
  }
}
