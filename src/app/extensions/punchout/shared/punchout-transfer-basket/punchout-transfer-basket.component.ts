import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { PunchoutFacade } from '../../facades/punchout.facade';

@Component({
  selector: 'ish-punchout-transfer-basket',
  templateUrl: './punchout-transfer-basket.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TranslatePipe],
})
export class PunchoutTransferBasketComponent {
  submitted = false;

  constructor(private punchoutFacade: PunchoutFacade) {}

  transferBasket() {
    this.submitted = true;
    this.punchoutFacade.transferBasket();
  }
}
