import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, Self } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { RxState } from '@rx-angular/state';
import { combineLatest } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { IconModule } from 'ish-core/icon.module';
import { CustomFieldsComponentInput } from 'ish-core/models/custom-field/custom-field.model';
import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { CustomFieldsFormlyComponent } from 'ish-shared/components/custom-fields/custom-fields-formly/custom-fields-formly.component';
import { LineItemCustomFieldsComponent } from 'ish-shared/components/line-item/line-item-custom-fields/line-item-custom-fields.component';

interface ComponentState {
  lineItem: Partial<Pick<LineItemView, 'id' | 'productSKU' | 'customFields'>>;
  visible: boolean;
  customFields: CustomFieldsComponentInput[];
  editMode: 'edit' | 'add'; // 'edit' for editable custom fields with existing values, else 'add' new values (relevant for translations)
}

/**
 * The Line Item Information Edit Component displays the basket line item attribute values. If editable it shows a link to add/edit these attributes.
 */
@Component({
  selector: 'ish-line-item-information-edit',
  templateUrl: './line-item-information-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    TranslateModule,
    LineItemCustomFieldsComponent,
    IconModule,
    NgbCollapse,
    ReactiveFormsModule,
    CustomFieldsFormlyComponent,
  ],
  providers: [ProductContextFacade],
})
export class LineItemInformationEditComponent extends RxState<ComponentState> implements OnInit {
  @Input({ required: true }) set lineItem(lineItem: ComponentState['lineItem']) {
    this.set({ lineItem });
    this.resetContext();
  }
  @Input() editable = false;

  @Output() updateItem = new EventEmitter<LineItemUpdate>();

  customFieldsForm = new FormGroup({});
  collapsed = true;

  constructor(@Self() private context: ProductContextFacade, private checkoutFacade: CheckoutFacade) {
    super();
  }

  ngOnInit() {
    this.connect(
      'visible',
      this.checkoutFacade.customFieldsForScope$('BasketLineItem'),
      (_, customFields) => customFields.length > 0
    );

    this.connect(
      'customFields',
      combineLatest([
        this.checkoutFacade.customFieldsForScope$('BasketLineItem'),
        this.select('lineItem', 'customFields'),
      ]),
      (_, [customFields, customFieldsData]) =>
        customFields.map(field => ({
          name: field.name,
          editable: field.editable,
          value: customFieldsData[field.name],
        }))
    );

    this.connect('editMode', this.select('lineItem', 'customFields'), (_, customFieldsData) =>
      Object.keys(customFieldsData).length > 0 ? 'edit' : 'add'
    );
  }

  getLineItemId() {
    return this.get('lineItem')?.id;
  }

  private resetContext() {
    const lineItem = this.get('lineItem');
    this.context.set({ sku: lineItem.productSKU });
  }

  save() {
    const customFields = this.customFieldsForm.value;

    this.updateItem.emit({
      itemId: this.getLineItemId(),
      customFields: Object.keys(customFields).length > 0 ? customFields : undefined,
    });
  }
  cancel() {
    this.collapsed = true;
    this.resetContext();
    this.customFieldsForm.reset();
  }
}
