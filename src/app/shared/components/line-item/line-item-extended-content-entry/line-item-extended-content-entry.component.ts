import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { OrderLineItem } from 'ish-core/models/order/order.model';

@Component({
  selector: 'ish-line-item-extended-content-entry',
  templateUrl: './line-item-extended-content-entry.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineItemExtendedContentEntryComponent implements OnChanges {
  @Input() key: keyof Pick<LineItemView & OrderLineItem, 'customerProductID' | 'partialOrderNo'>;
  @Input() lineItem: Partial<LineItemView & OrderLineItem>;
  @Input() editable: boolean;

  @Output() updateValue = new EventEmitter<string>();

  control = new FormControl<string>('');

  ngOnChanges(): void {
    this.reset();
  }

  reset() {
    if (this.lineItem && this.key) {
      this.control.setValue(this.lineItem[this.key]);
    }
  }

  update() {
    this.updateValue.emit(this.control.value);
  }
}
