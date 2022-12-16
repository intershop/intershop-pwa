import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { VariationOptionGroup } from 'ish-core/models/product-variation/variation-option-group.model';

@Component({
  selector: 'ish-product-variation-select-default',
  templateUrl: './product-variation-select-default.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductVariationSelectDefaultComponent {
  @Input() group: VariationOptionGroup;
  @Input() uuid: string;
  @Input() multipleOptions: boolean;

  @Output() changeOption = new EventEmitter<{ group: string; value: string }>();

  optionChange(group: string, target: EventTarget) {
    this.changeOption.emit({ group, value: (target as HTMLDataElement).value });
  }
}
