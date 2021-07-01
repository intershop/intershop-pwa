import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { QuickOrderFacade } from '../../facades/quick-order.facade';

declare interface AddProducts {
  sku: string;
  quantity: number;
}

@Component({
  selector: 'ish-quickorder-add-products-form',
  templateUrl: './quickorder-add-products-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickorderAddProductsFormComponent implements OnInit {
  @Output() productsToAdd = new EventEmitter<AddProducts[]>();
  quickOrderForm: FormGroup = new FormGroup({});
  model: { addProducts: AddProducts[] } = { addProducts: [] };
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'addProducts',
      type: 'repeat',
      templateOptions: {
        addText: 'quickorder.page.add.row',
        add5Text: 'quickorder.link.text',
        removeText: 'quickorder.page.remove.row',
      },
      fieldArray: {
        fieldGroupClassName: 'row list-item-row py-2',
        fieldGroup: [
          {
            key: 'sku',
            type: 'ish-input-field',
            className: 'col-sm-9 list-item search-container',
            // expressionProperties: {
            //   'templateOptions.required': (group: AddProducts) => group.quantity !== undefined,
            // },
            // asyncValidators: {
            //   validProduct: {
            //     expression: (control: FormControl) => this.quickorderFacade.validateProductFunction(this.cdRef),
            //     message: 'shopping_cart.direct_order.error.productnotfound',
            //   },
            // },
          },
          {
            key: 'quantity',
            type: 'ish-input-field',
            className: 'col-sm-3 list-item',
            templateOptions: {
              type: 'number',
            },
            expressionProperties: {
              'templateOptions.required': (group: AddProducts) => group.sku !== undefined,
            },
            validation: {
              messages: {
                required: 'product.quantity.notempty.text',
              },
            },
          },
        ],
      },
    },
  ];

  searchSuggestions: { imgPath: string; sku: string; name: string }[] = [];

  numberOfRows = 5;

  constructor(private quickorderFacade: QuickOrderFacade) {}

  ngOnInit() {
    this.initModel();

    // Dummy data to test search suggestion styling, typing 1234 will show the drop down with this product
    this.searchSuggestions.push({
      imgPath:
        'http://jxdemoserver.intershop.de/INTERSHOP/static/WFS/inSPIRED-inTRONICS_Business-Site/-/inSPIRED/en_US/S/4808544-118.jpg',
      sku: '1234',
      name: 'test',
    });
  }

  initModel() {
    this.model = { addProducts: [] };
    for (let i = 0; i < this.numberOfRows; i++) {
      this.model.addProducts.push({ sku: '', quantity: undefined });
    }
  }

  resetFields() {
    this.initModel();
  }

  get quickOrderFormDisabled() {
    return '';
    // return (
    //   this.quickOrderForm.invalid ||
    //   !this.quickOrderLines.value[0].sku ||
    //   !parseInt(this.quickOrderLines.value[0].quantity, 10)
    // );
  }

  onAddProducts() {
    const filledLines = this.model.addProducts.filter((p: AddProducts) => !!p.sku && !!p.quantity);
    this.productsToAdd.emit(filledLines);
    this.resetFields();
  }
}
