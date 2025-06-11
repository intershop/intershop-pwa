import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { mapToProperty } from 'ish-core/utils/operators';

import { OrderTemplatesFacade } from '../../facades/order-templates.facade';
import { OrderTemplate, OrderTemplateItem } from '../../models/order-template/order-template.model';

@Component({
  selector: 'ish-account-order-template-detail-page',
  templateUrl: './account-order-template-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOrderTemplateDetailPageComponent implements OnInit, OnDestroy {
  orderTemplate$: Observable<OrderTemplate>;
  orderTemplateError$: Observable<HttpError>;
  orderTemplateLoading$: Observable<boolean>;

  noOfUnavailableProducts$: Observable<number>;

  titleControl = new FormControl('');
  private destroy$ = new Subject<void>();
  private currentOrderTemplate: OrderTemplate;
  constructor(private orderTemplatesFacade: OrderTemplatesFacade) {}

  ngOnInit() {
    this.orderTemplate$ = this.orderTemplatesFacade.currentOrderTemplate$;
    this.orderTemplateLoading$ = this.orderTemplatesFacade.orderTemplateLoading$;
    this.orderTemplateError$ = this.orderTemplatesFacade.orderTemplateError$;
    this.noOfUnavailableProducts$ = this.orderTemplatesFacade.currentOrderTemplateOutOfStockItems$.pipe(
      mapToProperty('length')
    );

    this.orderTemplate$.pipe(takeUntil(this.destroy$)).subscribe(orderTemplate => {
      if (orderTemplate) {
        this.titleControl.setValue(orderTemplate.title);
        this.currentOrderTemplate = orderTemplate;
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  saveTitle() {
    if (this.currentOrderTemplate && this.titleControl.value !== this.currentOrderTemplate.title) {
      const updated: OrderTemplate = { ...this.currentOrderTemplate, title: this.titleControl.value };
      this.orderTemplatesFacade.updateOrderTemplate(updated);
    }
  }

  cancelEditTitle() {
    this.orderTemplate$.pipe(takeUntil(this.destroy$)).subscribe(ot => {
      this.titleControl.setValue(ot.title);
    });
  }

  trackByFn(_: number, item: OrderTemplateItem) {
    return item.id;
  }
}
