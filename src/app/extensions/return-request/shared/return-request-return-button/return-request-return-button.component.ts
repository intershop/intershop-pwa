import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Order } from 'ish-core/models/order/order.model';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { allowedStatus } from '../../util';

@Component({
  selector: 'ish-return-request-return-button',
  templateUrl: './return-request-return-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class ReturnRequestReturnButtonComponent {
  @Input() order: Order;
  @Input() isGuest: boolean;

  isModalOpen = false;

  showButton() {
    return allowedStatus(this.order?.statusCode);
  }

  openModal() {
    this.isModalOpen = true;
  }

  onModalClose() {
    this.isModalOpen = false;
  }
}
