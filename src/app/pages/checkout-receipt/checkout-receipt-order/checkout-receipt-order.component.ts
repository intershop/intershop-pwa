
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { LazyLoadingContentDirective } from 'ish-core/directives/lazy-loading-content.directive';
import { Order } from 'ish-core/models/order/order.model';
import { RecurringOrder } from 'ish-core/models/recurring-order/recurring-order.model';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { ModalDialogLinkComponent } from 'ish-shared/components/common/modal-dialog-link/modal-dialog-link.component';

@Component({
  selector: 'ish-checkout-receipt-order',
  templateUrl: './checkout-receipt-order.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    TranslatePipe,
    ModalDialogLinkComponent,
    ContentIncludeComponent,
    RouterLink,
    LazyLoadingContentDirective],
})
export class CheckoutReceiptOrderComponent {
  @Input({ required: true }) order: Order | RecurringOrder;
}
