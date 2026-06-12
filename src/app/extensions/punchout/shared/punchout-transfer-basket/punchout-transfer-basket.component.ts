import { ChangeDetectionStrategy, Component } from '@angular/core';

import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { PunchoutFacade } from '../../facades/punchout.facade';

@Component({
  selector: 'ish-punchout-transfer-basket',
  templateUrl: './punchout-transfer-basket.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class PunchoutTransferBasketComponent {
  submitted = false;

  constructor(private punchoutFacade: PunchoutFacade) {}

  transferBasket() {
    this.submitted = true;
    this.punchoutFacade.transferBasket();
  }
}
