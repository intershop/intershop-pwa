import { ChangeDetectionStrategy, Component, Input, Signal, effect, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { OrderTemplatesFacade } from '../../facades/order-templates.facade';
import { OrderTemplate } from '../../models/order-template/order-template.model';
import { OrderTemplatePreferencesDialogComponent } from '../order-template-preferences-dialog/order-template-preferences-dialog.component';

@Component({
  selector: 'ish-order-create-order-template',
  templateUrl: './order-create-order-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * The Create Order Template from Order displays a button which adds the current order to to a new order template.
 */

@GenerateLazyComponent()
export class OrderCreateOrderTemplateComponent {
  @Input({ required: true }) lineItems: LineItemView[];

  @Input() cssClass: string;

  orderTemplateLoading: Signal<boolean>;
  displaySpinner = signal(false);

  constructor(private orderTemplatesFacade: OrderTemplatesFacade) {
    this.orderTemplateLoading = toSignal(this.orderTemplatesFacade.orderTemplateLoading$, { initialValue: false });
    effect(
      () => {
        if (!this.orderTemplateLoading()) {
          this.displaySpinner.set(this.orderTemplateLoading());
        }
      },
      { allowSignalWrites: true }
    );
  }

  openModal(modal: OrderTemplatePreferencesDialogComponent) {
    modal.show();
  }

  createOrderTemplate(orderTemplate: OrderTemplate) {
    this.displaySpinner.set(true);

    this.orderTemplatesFacade.createOrderTemplateFromLineItems(orderTemplate, this.lineItems);
  }
}
