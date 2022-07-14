import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { debounceTime, map, tap } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

/**
 * The Direct Order Component displays a form to insert a product sku and quantity to add it to the cart.
 */
@Component({
  selector: 'ish-direct-order',
  templateUrl: './direct-order.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProductContextFacade],
})
@GenerateLazyComponent()
export class DirectOrderComponent implements OnInit, AfterViewInit {
  directOrderForm = new UntypedFormGroup({});
  fields: FormlyFieldConfig[];
  model = { sku: '' };

  hasQuantityError$: Observable<boolean>;
  loading$: Observable<boolean>;

  constructor(
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

  /**
   * Set the form control field to the product context and handle its behavior.
   */
  ngAfterViewInit() {
    this.context.connect(
      'sku',
      this.directOrderForm.get('sku').valueChanges.pipe(
        tap(() => this.context.set('loading', () => true)),
        debounceTime(500)
      )
    );
    const skuControl = this.directOrderForm.get('sku');
    skuControl.setAsyncValidators(() =>
      this.context
        .select('product')
        .pipe(map(product => (product.failed && skuControl.value.trim !== '' ? { validProduct: false } : undefined)))
    );

    this.context.connect('maxQuantity', this.checkoutFacade.basketMaxItemQuantity$);
    this.loading$ = this.context.select('loading');
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
        validation: {
          messages: {
            validProduct: () => this.translate.get('quickorder.page.error.invalid.product', { 0: this.model.sku }),
          },
        },
      },
    ];
  }
}
