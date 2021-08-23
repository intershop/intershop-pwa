import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { SkuQuantityType } from 'ish-core/models/product/product.helper';

/**
 * The Quick Add Products Component displays a form to insert multiple product sku and quantity to add them to the cart.
 */
@Component({
  selector: 'ish-quickorder-add-products-form',
  templateUrl: './quickorder-add-products-form.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class QuickorderAddProductsFormComponent implements OnInit {
  quickOrderForm: FormGroup = new FormGroup({});
  model: { addProducts: SkuQuantityType[] } = { addProducts: [] };
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[];

  numberOfRows = 5;

  constructor(private translate: TranslateService, private shoppingFacade: ShoppingFacade) {}

  ngOnInit() {
    this.initModel();
    this.fields = this.getFields();
  }

  reset() {
    this.options.resetModel();
    this.initModel();
  }

  onAddProducts() {
    const products = this.model.addProducts.filter((p: SkuQuantityType) => !!p.sku && !!p.quantity);
    if (products.length > 0) {
      products.forEach(product => {
        this.shoppingFacade.addProductToBasket(product.sku, product.quantity);
      });
    }
    this.reset();
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
        templateOptions: {
          addText: 'quickorder.page.add.row',
          addMoreText: 'quickorder.page.add.row.multiple',
          numberMoreRows: this.numberOfRows,
        },
        fieldArray: {
          fieldGroupClassName: 'row list-item-row py-2',
          fieldGroup: [
            {
              key: 'sku',
              type: 'ish-text-input-field',
              className: 'col-12 list-item search-container',
              templateOptions: {
                fieldClass: 'col-12',
                placeholder: 'shopping_cart.direct_order.item_placeholder',
              },
              expressionProperties: {
                'templateOptions.required': (control: SkuQuantityType) => !!control.quantity,
              },
              validation: {
                messages: {
                  required: 'quickorder.page.quantityWithoutSKU',
                  validProduct: (_, field) =>
                    this.translate.get('quickorder.page.error.invalid.product', {
                      0: this.model.addProducts[parseInt(field.parent.key.toString(), 10)].sku,
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
