import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TactonFacade } from '../../../facades/tacton.facade';
import { TactonConfigParameterComponent } from '../tacton-config-parameter/tacton-config-parameter.component';

@Component({
  selector: 'ish-tacton-text-buttons',
  templateUrl: './tacton-text-buttons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: ['.btn { margin-right: 0px !important }'],
})
export class TactonTextButtonsComponent extends TactonConfigParameterComponent {
  constructor(protected facade: TactonFacade) {
    super(facade);
  }
}
