import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, mapTo, switchMap, takeUntil, tap } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductCompletenessLevel, ProductHelper } from 'ish-core/models/product/product.helper';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';
import { whenTruthy } from 'ish-core/utils/operators';

@Component({
  selector: 'ish-direct-order',
  templateUrl: './direct-order.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class DirectOrderComponent implements OnInit, OnDestroy {
  directOrderForm = new FormGroup({});
  fields: FormlyFieldConfig[];
  model = { sku: '' };

  hasQuantityError$: Observable<boolean>;
  loading = false;
  maxItemQuantity = 100;

  private destroy$ = new Subject();

  constructor(
    private shoppingFacade: ShoppingFacade,
    private checkoutFacade: CheckoutFacade,
    private translate: TranslateService,
    private context: ProductContextFacade
  ) {}

  ngOnInit() {
    this.fields = this.getFields();
    this.hasQuantityError$ = this.context.select('hasQuantityError');
    this.checkoutFacade.basketMaxItemQuantity$
      .pipe(takeUntil(this.destroy$))
      .subscribe(qty => (this.maxItemQuantity = qty));
    this.setContext();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    this.context.addToBasket();
    this.directOrderForm.reset();
    this.setContext();
  }

  private getFields(): FormlyFieldConfig[] {
    return [
      {
        key: 'sku',
        type: 'ish-text-input-field',
        templateOptions: {
          fieldClass: 'col-12',
          placeholder: 'shopping_cart.direct_order.item_placeholder',
          autocomplete: true,
        },
        hooks: {
          onInit: field => {
            field.form
              .get('sku')
              .valueChanges.pipe(whenTruthy(), takeUntil(this.destroy$))
              .subscribe(sku => this.context.set('sku', () => sku));
          },
        },
        asyncValidators: {
          validProduct: {
            expression: (control: FormControl) =>
              control.valueChanges.pipe(
                tap(sku => {
                  if (!sku) {
                    control.setErrors(undefined);
                  } else {
                    this.loading = true;
                  }
                }),
                whenTruthy(),
                debounceTime(500),
                switchMap(() => this.shoppingFacade.product$(control.value, ProductCompletenessLevel.List)),
                tap(product => {
                  control.setErrors(ProductHelper.isFailedLoading(product) ? { validProduct: false } : undefined);
                  this.loading = false;
                }),
                mapTo(undefined)
              ),
            message: () => this.translate.get('quickorder.page.error.invalid.product', { 0: this.model.sku }),
          },
        },
      },
    ];
  }

  private setContext() {
    this.context.set('sku', () => ' ');
    this.context.set('quantity', () => 1);
    this.context.set('minQuantity', () => 1);
    this.context.set('maxQuantity', () => this.maxItemQuantity);
    this.context.set('stepQuantity', () => 1);
    this.context.set('hasQuantityError', () => false);
  }
}
