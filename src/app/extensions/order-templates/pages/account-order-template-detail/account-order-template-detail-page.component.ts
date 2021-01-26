import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil, withLatestFrom } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

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

  selectedItemsForm: FormArray;
  selectedItems: OrderTemplateItem[];
  dummyProduct = { sku: 'dummy', available: true };

  private destroy$ = new Subject();

  constructor(private orderTemplatesFacade: OrderTemplatesFacade, private shoppingFacade: ShoppingFacade) {}

  ngOnInit() {
    this.orderTemplate$ = this.orderTemplatesFacade.currentOrderTemplate$;
    this.orderTemplateLoading$ = this.orderTemplatesFacade.orderTemplateLoading$;
    this.orderTemplateError$ = this.orderTemplatesFacade.orderTemplateError$;
    this.initForm();

    this.selectedItemsForm.valueChanges
      .pipe(withLatestFrom(this.orderTemplate$), takeUntil(this.destroy$))
      .subscribe(([, orderTemplate]) => {
        this.selectedItems = this.filterItems(orderTemplate);
      });
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
    this.destroy$.complete();
  }

  editPreferences(orderTemplate: OrderTemplate, orderTemplateName: string) {
    this.orderTemplatesFacade.updateOrderTemplate({
      ...orderTemplate,
      id: orderTemplateName,
    });
  }

  filterItems(orderTemplate): OrderTemplateItem[] {
    return orderTemplate.items.filter(item =>
      this.selectedItemsForm.value.find(p => p.sku === item.sku && p.productCheckbox === true)
    );
  }

  addSelectedItemsToCart(orderTemplate: OrderTemplate) {
    this.filterItems(orderTemplate).forEach(item => {
      this.shoppingFacade.addProductToBasket(item.sku, item.desiredQuantity.value);
    });
  }
}
