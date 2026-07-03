import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { SkuQuantityType } from 'ish-core/models/product/product.helper';

/**
 * The Quick Add Products Component displays a form to insert multiple product sku and quantity to add them to the cart.
 */
@Component({
  selector: 'ish-quickorder-add-products-form',
  standalone: false,
  templateUrl: './quickorder-add-products-form.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class QuickorderAddProductsFormComponent implements OnInit {
  quickOrderForm: FormGroup = new FormGroup({});
  model: { addProducts: SkuQuantityType[] } = { addProducts: [] };
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[];

  private numberOfRows = 5;

  constructor(
    private translate: TranslateService,
    private shoppingFacade: ShoppingFacade
  ) {}

  ngOnInit() {
    this.initModel();
    this.fields = this.getFields();
  }

  reset() {
    this.options.resetModel();
    this.initModel();
  }

  onAddProducts(form: FormGroupDirective) {
    const products = this.model.addProducts.filter((p: SkuQuantityType) => !!p.sku && !!p.quantity);
    if (products.length === 0 || this.hasValidationError()) {
      return;
    }
    products.forEach(product => {
      this.shoppingFacade.addProductToBasket(product.sku, product.quantity);
    });
    form?.resetForm();
    this.reset();
  }

  private hasValidationError(): boolean {
    if (this.quickOrderForm.valid) {
      return false;
    }
    for (let i = 0; i < this.model.addProducts.length; i++) {
      const skuControl = this.quickOrderForm.get(`addProducts.${i}.sku`);
      if (skuControl?.errors) {
        return true;
      }
    }
    return false;
  }

  private initModel() {
    this.model = { addProducts: [] };
    for (let i = 0; i < this.numberOfRows; i++) {
      this.model.addProducts.push({ sku: '', quantity: 1 });
    }
  }

  /**
   * returns the field with a repeating type
   * repeat contains the representing of the form with form fields and links to add and remove lines (check quickorder-repeat-form.component for more information)
   * the field array give the input field with validators of the sku for each line (which are represented by the objects of the model array)
   */
  private getFields(): FormlyFieldConfig[] {
    return [
      {
        key: 'addProducts',
        type: 'repeat',
        props: {
          addText: 'quickorder.page.add.row',
          addMoreText: 'quickorder.page.add.row.multiple',
          numberMoreRows: this.numberOfRows,
        },
        fieldArray: {
          fieldGroupClassName: 'row quickorder-line-item',
          fieldGroup: [
            {
              key: 'sku',
              type: 'ish-text-input-field',
              className: 'col-12 list-item search-container',
              props: {
                fieldClass: 'col-12',
                placeholder: 'shopping_cart.direct_order.item_placeholder',
                ariaLabel: 'shopping_cart.direct_order.item_placeholder',
              },
              expressions: {
                'props.required': (field: FormlyFieldConfig) => {
                  const currentIndex = parseInt(field?.parent?.key?.toString() || '-1', 10);
                  if (currentIndex !== 0) {
                    return false;
                  }
                  return !this.model.addProducts.find((p: SkuQuantityType) => p.sku && p.quantity);
                },
              },
              asyncValidators: {
                // the product context per row is provided by the quickorder repeat field (see field.props.productContext)
                validProduct: (control: AbstractControl, field: FormlyFieldConfig) => {
                  const context: ProductContextFacade = field.props?.productContext;
                  const sku: string = control.value?.trim();
                  if (!context || !sku) {
                    return of(true);
                  }
                  // wait until the product for the entered sku has settled, then complete the validation
                  return context.select('product').pipe(
                    filter(product => product?.sku?.trim() === sku),
                    take(1),
                    map(product => !product.failed)
                  );
                },
              },
              validation: {
                messages: {
                  required: 'quickorder.page.quantityWithoutSKU',
                  // the message keeps showing the SKU that previously failed while the user is typing a correction
                  validProduct: (_error: unknown, field: FormlyFieldConfig) =>
                    this.translate.get('quickorder.page.error.invalid.product', {
                      0: (field.props?.productContext as ProductContextFacade)?.get('sku'),
                    }),
                },
              },
            },
          ],
        },
      },
    ];
  }
}
