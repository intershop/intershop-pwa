import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

@Component({
  selector: 'ish-clear-basket',
  templateUrl: './clear-basket.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ModalDialogComponent, NgClass, TranslatePipe],
})
export class ClearBasketComponent {
  @Input() cssClass: string;

  constructor(private checkoutFacade: CheckoutFacade) {}

  clearBasket() {
    this.checkoutFacade.deleteBasketItems();
  }
}
