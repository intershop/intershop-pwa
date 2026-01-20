import { NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';

import { IconModule } from 'ish-core/icon.module';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { OrderTemplatesFacade } from '../../facades/order-templates.facade';
import { OrderTemplate } from '../../models/order-template/order-template.model';
import { OrderTemplatePreferencesDialogComponent } from '../order-template-preferences-dialog/order-template-preferences-dialog.component';

@Component({
  selector: 'ish-order-create-order-template',
  templateUrl: './order-create-order-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgClass, TranslateModule, IconModule, OrderTemplatePreferencesDialogComponent, NgIf],
})
/**
 * The Create Order Template from Order displays a button which adds the current order to to a new order template.
 */

@GenerateLazyComponent()
export class OrderCreateOrderTemplateComponent {
  @Input({ required: true }) lineItems: LineItemView[];
  @Input() cssClass: string;

  displaySpinner: Signal<boolean>;

  constructor(private orderTemplatesFacade: OrderTemplatesFacade) {
    this.displaySpinner = toSignal(this.orderTemplatesFacade.orderTemplateLoading$, { initialValue: false });
  }

  openModal(modal: OrderTemplatePreferencesDialogComponent) {
    modal.show();
  }

  createOrderTemplate(orderTemplate: OrderTemplate) {
    this.orderTemplatesFacade.createOrderTemplateFromLineItems(orderTemplate, this.lineItems);
  }
}
