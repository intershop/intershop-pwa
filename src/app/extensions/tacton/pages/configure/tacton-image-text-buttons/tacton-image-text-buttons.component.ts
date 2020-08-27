import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TactonFacade } from '../../../facades/tacton.facade';
import { TactonConfigParameterComponent } from '../tacton-config-parameter/tacton-config-parameter.component';

@Component({
  selector: 'ish-tacton-image-text-buttons',
  templateUrl: './tacton-image-text-buttons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TactonImageTextButtonsComponent extends TactonConfigParameterComponent {
  constructor(protected facade: TactonFacade) {
    super(facade);
  }
}
