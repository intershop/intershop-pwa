import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { VariationOptionGroup } from 'ish-core/models/product-variation/variation-option-group.model';

@Component({
  selector: 'ish-product-variation-select-swatch',
  templateUrl: './product-variation-select-swatch.component.html',
  styleUrls: ['./product-variation-select-swatch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgFor, NgIf, NgStyle, NgClass],
})
export class ProductVariationSelectSwatchComponent {
  @Input({ required: true }) group: VariationOptionGroup;

  @Output() changeOption = new EventEmitter<{ group: string; value: string }>();

  optionChange(group: string, value: string) {
    this.changeOption.emit({ group, value });
  }
}
