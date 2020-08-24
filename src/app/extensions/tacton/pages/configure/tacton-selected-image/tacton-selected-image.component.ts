import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TactonFacade } from '../../../facades/tacton.facade';
import { TactonConfigParameterComponent } from '../tacton-config-parameter/tacton-config-parameter.component';

@Component({
  selector: 'ish-tacton-selected-image',
  templateUrl: './tacton-selected-image.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TactonSelectedImageComponent extends TactonConfigParameterComponent {
  constructor(protected facade: TactonFacade) {
    super(facade);
  }
}
