import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TactonFacade } from '../../../facades/tacton.facade';
import { TactonConfigParameterComponent } from '../tacton-config-parameter/tacton-config-parameter.component';

@Component({
  selector: 'ish-tacton-number-input',
  templateUrl: './tacton-number-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TactonNumberInputComponent extends TactonConfigParameterComponent {
  constructor(protected facade: TactonFacade) {
    super(facade);
  }
}
