import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Self,
  ViewChild,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { RxState } from '@rx-angular/state';
import { combineLatest, take } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { CustomFieldsComponentInput } from 'ish-core/models/custom-field/custom-field.model';
import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { ProductHelper } from 'ish-core/models/product/product.model';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

interface ComponentState {
  loading: boolean;
  visible: boolean;
  variationEditable: boolean;
  lineItem: Partial<Pick<LineItemView, 'id' | 'quantity' | 'productSKU' | 'customFields' | 'singleBasePrice'>>;
  customFields: CustomFieldsComponentInput[];
}

/**
 * The Line Item Edit Component displays an edit-link and edit-dialog.
 */
@Component({
  selector: 'ish-line-item-edit',
  templateUrl: './line-item-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProductContextFacade],
})
export class LineItemEditComponent extends RxState<ComponentState> implements OnInit, AfterViewInit {
  @ViewChild('modalDialog') modalDialogRef: ModalDialogComponent<unknown>;

  @Input({ required: true }) set lineItem(lineItem: ComponentState['lineItem']) {
    this.set({ lineItem });
    this.resetContext();
  }

  @Output() updateItem = new EventEmitter<LineItemUpdate>();

  customFieldsForm = new UntypedFormGroup({});

  constructor(@Self() private context: ProductContextFacade, private appFacade: AppFacade) {
    super();
  }

  ngOnInit() {
    this.connect(
      'variationEditable',
      combineLatest([
        this.appFacade.serverSetting$<boolean>('preferences.ChannelPreferences.EnableAdvancedVariationHandling'),
        this.context.select('product'),
      ]),
      (_, [advancedVariationHandlingEnabled, product]) =>
        ProductHelper.isVariationProduct(product) && !advancedVariationHandlingEnabled
    );

    this.connect(
      'visible',
      combineLatest([this.select('variationEditable'), this.appFacade.customFieldsForScope$('BasketLineItem')]),
      (_, [variationEditable, customFields]) => variationEditable || customFields.length > 0
    );

    this.connect('loading', this.context.select('loading'));

    this.connect(
      'customFields',
      combineLatest([this.appFacade.customFieldsForScope$('BasketLineItem'), this.select('lineItem', 'customFields')]),
      (_, [customFields, customFieldsData]) =>
        customFields.map(field => ({
          name: field.name,
          editable: field.editable,
          value: customFieldsData[field.name],
        }))
    );
  }

  ngAfterViewInit(): void {
    this.context.hold(this.context.select('product'), product => {
      this.modalDialogRef.options.confirmDisabled = !product.available;
      this.modalDialogRef.options.titleText = product.name;
    });
  }

  private resetContext() {
    const lineItem = this.get('lineItem');
    this.context.set({ quantity: lineItem.quantity.value, sku: lineItem.productSKU });
  }

  show() {
    this.resetContext();

    this.context.hold(this.modalDialogRef.confirmed.pipe(take(1)), () => {
      const customFields = this.customFieldsForm.value;

      this.updateItem.emit({
        itemId: this.get('lineItem').id,
        sku: this.context.get('sku'),
        quantity: this.context.get('quantity'),
        customFields: Object.keys(customFields).length > 0 ? customFields : undefined,
      });
    });

    this.modalDialogRef.show();
  }
}
