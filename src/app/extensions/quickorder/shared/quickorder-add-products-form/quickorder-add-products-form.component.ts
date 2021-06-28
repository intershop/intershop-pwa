import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { debounceTime, switchMap, takeUntil, tap } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductCompletenessLevel, ProductHelper } from 'ish-core/models/product/product.helper';

declare interface AddProducts {
  sku: string;
  quantity: number;
}

@Component({
  selector: 'ish-quickorder-add-products-form',
  templateUrl: './quickorder-add-products-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickorderAddProductsFormComponent implements OnInit, OnDestroy {
  quickOrderForm: FormGroup = new FormGroup({});
  model: { addProducts: AddProducts[] } = { addProducts: [] };
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[];

  private destroy$ = new Subject();

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
    const products = this.model.addProducts.filter((p: AddProducts) => !!p.sku && !!p.quantity);
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
   * repeat contains the representing of the form with form fields and links to add and remove lines
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
              asyncValidators: {
                validProduct: {
                  expression: (control: FormControl) =>
                    control.valueChanges.pipe(
                      tap(sku => {
                        if (!sku) {
                          control.setErrors(undefined);
                        }
                      }),
                      debounceTime(500),
                      switchMap(() => this.shoppingFacade.product$(control.value, ProductCompletenessLevel.List)),
                      tap(product => {
                        const failed = ProductHelper.isFailedLoading(product);
                        control.setErrors(failed ? { validProduct: false } : undefined);
                      }),
                      takeUntil(this.destroy$)
                    ),
                  message: (_: unknown, field: FormlyFieldConfig) =>
                    this.translate.get('quickorder.page.error.invalid.product', {
                      0: this.model.addProducts[parseInt(field.parent.key.toString(), 10)].sku,
                    }),
                },
              },
              expressionProperties: {
                'templateOptions.required': (control: { sku: string; quantity: number }) => !!control.quantity,
              },
              validation: {
                messages: {
                  required: 'quickorder.page.quantityWithoutSKU',
                },
              },
            },
          ],
        },
      },
    ];
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
