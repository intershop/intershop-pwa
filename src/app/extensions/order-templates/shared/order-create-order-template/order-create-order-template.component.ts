import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

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

  constructor(private orderTemplatesFacade: OrderTemplatesFacade) {}

  openModal(modal: OrderTemplatePreferencesDialogComponent) {
    modal.show();
  }

  createOrderTemplate(orderTemplate: OrderTemplate) {
    this.orderTemplatesFacade.createOrderTemplateFromLineItems(orderTemplate, this.lineItems);
  }
}
