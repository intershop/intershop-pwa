import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { OrderLineItem } from 'ish-core/models/order/order.model';

/**
 * The Extended Line Item Component displays additional line items attributes like partialOrderNo
 * and customerProductID. ALso editing of this attributes are possible with this component.
 */
@Component({
  selector: 'ish-line-item-extended-content-edit',
  templateUrl: './line-item-extended-content-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineItemExtendedContentEditComponent implements OnInit {
  @Input() lineItem: Partial<LineItemView & OrderLineItem>;

  model: { partialOrderNo: string; customerProductID: string };
  fields: FormlyFieldConfig[];
  extendedAttributesForm = new FormGroup({});
  options: FormlyFormOptions = {};
  showExtendAttributeForm = false;
  checkoutFacade: CheckoutFacade;

  constructor(cF: CheckoutFacade) {
    this.checkoutFacade = cF;
  }

  ngOnInit() {
    this.fields = this.getFields();
    this.model = {
      partialOrderNo: this.lineItem.partialOrderNo ? this.lineItem.partialOrderNo : '',
      customerProductID: this.lineItem.customerProductID ? this.lineItem.customerProductID : '',
    };
  }

  private getFields() {
    return [
      {
        key: 'partialOrderNo',
        type: 'ish-text-input-field',
        props: {
          labelClass: 'col-md-4',
          fieldClass: 'col-md-8',
          label: 'line-item.partialOrderNo.label',
          placeholder: 'line-item.partialOrderNo.placeholder',
        },
      },
      {
        key: 'customerProductID',
        type: 'ish-text-input-field',
        props: {
          labelClass: 'col-md-4',
          fieldClass: 'col-md-8',
          label: 'line-item.customerProductID.label',
          placeholder: 'line-item.customerProductID.placeholder',
        },
      },
    ];
  }

  onSubmit() {
    this.checkoutFacade.updateBasketItem({
      itemId: this.lineItem.id,
      quantity: this.lineItem.quantity.value,
      customerProductID: this.model.customerProductID,
      partialOrderNo: this.model.partialOrderNo,
    });
    this.openExtendAttributeForm(false);
  }

  openExtendAttributeForm(value: boolean) {
    this.showExtendAttributeForm = value;
  }
}
