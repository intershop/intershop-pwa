import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { VariationOptionGroup } from 'ish-core/models/product-variation/variation-option-group.model';

@Component({
  selector: 'ish-product-variation-select-default',
  templateUrl: './product-variation-select-default.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, TranslateModule, NgFor],
})
export class ProductVariationSelectDefaultComponent {
  @Input({ required: true }) group: VariationOptionGroup;
  @Input() uuid: string;
  @Input() multipleOptions: boolean;

  @Output() readonly changeOption = new EventEmitter<{ group: string; value: string }>();

  optionChange(group: string, target: EventTarget) {
    this.changeOption.emit({ group, value: (target as HTMLDataElement).value });
  }
}
