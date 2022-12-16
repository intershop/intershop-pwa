import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { VariationOptionGroup } from 'ish-core/models/product-variation/variation-option-group.model';

@Component({
  selector: 'ish-product-variation-select-swatch',
  templateUrl: './product-variation-select-swatch.component.html',
  styleUrls: ['./product-variation-select-swatch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductVariationSelectSwatchComponent {
  @Input() group: VariationOptionGroup;

  @Output() changeOption = new EventEmitter<{ group: string; value: string }>();

  optionChange(group: string, value: string) {
    this.changeOption.emit({ group, value });
  }
}
