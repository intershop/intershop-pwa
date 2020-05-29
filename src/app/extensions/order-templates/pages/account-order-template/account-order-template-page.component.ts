import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { OrderTemplatesFacade } from '../../facades/order-templates.facade';
import { OrderTemplate } from '../../models/order-template/order-template.model';

@Component({
  selector: 'ish-account-order-template-page',
  templateUrl: './account-order-template-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOrderTemplatePageComponent implements OnInit {
  /**
   * The list of order templates of the customer.
   */
  orderTemplates$: Observable<OrderTemplate[]>;
  /**
   * Indicator for loading state of order templates
   */
  orderTemplateLoading$: Observable<boolean>;
  /**
   * Error state in case of an error during creation of a new order template.
   */
  orderTemplateError$: Observable<HttpError>;

  constructor(private orderTemplatesFacade: OrderTemplatesFacade) {}

  ngOnInit() {
    this.orderTemplates$ = this.orderTemplatesFacade.orderTemplates$;
    this.orderTemplateLoading$ = this.orderTemplatesFacade.orderTemplateLoading$;
    this.orderTemplateError$ = this.orderTemplatesFacade.orderTemplateError$;
  }

  /** dispatch delete request */
  deleteOrderTemplate(id: string) {
    this.orderTemplatesFacade.deleteOrderTemplate(id);
  }

  /** dispatch creation request */
  addOrderTemplate(orderTemplate: OrderTemplate) {
    this.orderTemplatesFacade.addOrderTemplate(orderTemplate);
  }
}
