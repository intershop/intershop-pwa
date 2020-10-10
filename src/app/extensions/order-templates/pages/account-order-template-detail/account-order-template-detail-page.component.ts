import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { OrderTemplatesFacade } from '../../facades/order-templates.facade';
import { OrderTemplate } from '../../models/order-template/order-template.model';

@Component({
  selector: 'ish-account-order-template-detail-page',
  templateUrl: './account-order-template-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOrderTemplateDetailPageComponent implements OnInit {
  orderTemplate$: Observable<OrderTemplate>;
  orderTemplateError$: Observable<HttpError>;
  orderTemplateLoading$: Observable<boolean>;

  constructor(private orderTemplatesFacade: OrderTemplatesFacade) {}

  ngOnInit() {
    this.orderTemplate$ = this.orderTemplatesFacade.currentOrderTemplate$;
    this.orderTemplateLoading$ = this.orderTemplatesFacade.orderTemplateLoading$;
    this.orderTemplateError$ = this.orderTemplatesFacade.orderTemplateError$;
  }

  editPreferences(orderTemplate: OrderTemplate, orderTemplateName: string) {
    this.orderTemplatesFacade.updateOrderTemplate({
      ...orderTemplate,
      id: orderTemplateName,
    });
  }
}
