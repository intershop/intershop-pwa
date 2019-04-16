import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { VariationOptionGroup } from 'ish-core/models/product-variation/variation-option-group.model';
import { VariationSelection } from 'ish-core/models/product-variation/variation-selection.model';

@Component({
  selector: 'ish-product-variation-select',
  templateUrl: './product-variation-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductVariationSelectComponent implements OnChanges, OnDestroy {
  @Input() variationOptions: VariationOptionGroup[] = [];
  @Output() selectVariation = new EventEmitter<VariationSelection>();

  form: FormGroup;
  private destroy$ = new Subject();

  ngOnChanges() {
    this.initForm();
  }

  initForm() {
    if (this.variationOptions) {
      this.form = this.buildSelectForm(this.variationOptions);
      this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(this.selectVariation);
    }
  }

  /**
   * Build the product variations select form
   */
  buildSelectForm(optionGroups: VariationOptionGroup[]): FormGroup {
    return new FormGroup(
      optionGroups.reduce((acc, group) => {
        const activeOption = group.options.find(o => o.active);

        return {
          ...acc,
          [group.id]: new FormControl(activeOption.value),
        };
      }, {})
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
