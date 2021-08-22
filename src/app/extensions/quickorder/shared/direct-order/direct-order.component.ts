import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, switchMap, takeUntil, tap } from 'rxjs/operators';

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
  providers: [ProductContextFacade],
})
@GenerateLazyComponent()
export class DirectOrderComponent implements OnInit, OnDestroy, AfterViewInit {
  directOrderForm = new FormGroup({});
  fields: FormlyFieldConfig[];
  model = { sku: '' };

  hasQuantityError$: Observable<boolean>;
  loading = false;

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
    this.context.set('quantity', () => 1);
    this.context.config = { quantity: true };
  }

  ngAfterViewInit() {
    this.context.connect('sku', this.directOrderForm.get('sku').valueChanges);
    this.context.connect('maxQuantity', this.checkoutFacade.basketMaxItemQuantity$);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    this.context.addToBasket();
    this.directOrderForm.reset();
    this.context.set('quantity', () => 1);
  }

  private getFields(): FormlyFieldConfig[] {
    return [
      {
        key: 'sku',
        type: 'ish-text-input-field',
        templateOptions: {
          fieldClass: 'col-12',
          placeholder: 'shopping_cart.direct_order.item_placeholder',
          attributes: { autocomplete: 'on' },
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
                takeUntil(this.destroy$)
              ),
            message: () => this.translate.get('quickorder.page.error.invalid.product', { 0: this.model.sku }),
          },
        },
      },
    ];
  }
}
