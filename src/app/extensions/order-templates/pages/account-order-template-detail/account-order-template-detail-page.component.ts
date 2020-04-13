import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { OrderTemplatesFacade } from '../../facades/order-templates.facade';
import { OrderTemplate } from '../../models/order-template/order-template.model';

@Component({
  selector: 'ish-account-order-template-detail-page',
  templateUrl: './account-order-template-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOrderTemplateDetailPageComponent implements OnInit, OnDestroy {
  orderTemplate$: Observable<OrderTemplate>;
  orderTemplateError$: Observable<HttpError>;
  orderTemplateLoading$: Observable<boolean>;

  selectedItemsForm: FormArray;

  private destroy$ = new Subject();

  constructor(private orderTemplatesFacade: OrderTemplatesFacade, private shoppingFacade: ShoppingFacade) {}

  ngOnInit() {
    this.orderTemplate$ = this.orderTemplatesFacade.currentOrderTemplate$;
    this.orderTemplateLoading$ = this.orderTemplatesFacade.orderTemplateLoading$;
    this.orderTemplateError$ = this.orderTemplatesFacade.orderTemplateError$;
    this.initForm();
  }

  private initForm() {
    this.createSelectedItemsForm();

    // On item moved or deleted clear form array
    this.orderTemplate$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.selectedItemsForm.controls.length > 0) {
        this.createSelectedItemsForm();
      }
    });
  }

  createSelectedItemsForm() {
    this.selectedItemsForm = new FormArray([]);
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  editPreferences(orderTemplate: OrderTemplate, orderTemplateName: string) {
    this.orderTemplatesFacade.updateOrderTemplate({
      ...orderTemplate,
      id: orderTemplateName,
    });
  }

  addSelectedItemsToCart(orderTemplate: OrderTemplate) {
    orderTemplate.items.forEach(item => {
      if (this.selectedItemsForm.value.find(p => p.sku === item.sku && p.productCheckbox === true)) {
        this.shoppingFacade.addProductToBasket(item.sku, item.desiredQuantity.value);
      }
    });
  }
}
