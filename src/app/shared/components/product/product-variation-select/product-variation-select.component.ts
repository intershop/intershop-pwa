import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UUID } from 'angular2-uuid';
import { isEqual } from 'lodash-es';
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
  @Output() selectVariation = new EventEmitter<{ selection: VariationSelection; changedAttribute?: string }>();

  form: FormGroup;
  uuid = UUID.UUID();
  initialSelection: VariationSelection;

  private destroy$ = new Subject();

  ngOnChanges() {
    this.initForm();
  }

  initForm() {
    if (this.variationOptions) {
      this.form = this.buildSelectForm(this.variationOptions);
      this.initialSelection = this.form.getRawValue();
      this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(selection => {
        this.selectVariation.emit({ selection, changedAttribute: this.getChangedAttribute(selection) });
      });
    }
  }

  getChangedAttribute(selection) {
    const diff = Object.keys(selection).reduce(
      (acc, k) => (isEqual(selection[k], this.initialSelection[k]) ? acc : acc.concat(k)),
      []
    );
    return diff && diff.length === 1 ? diff[0] : undefined;
  }

  getActiveOption(group: VariationOptionGroup) {
    return group.options.find(o => o.active);
  }

  /**
   * Build the product variations select form
   */
  buildSelectForm(optionGroups: VariationOptionGroup[]): FormGroup {
    return new FormGroup(
      optionGroups.reduce((acc, group) => {
        const activeOption = this.getActiveOption(group);

        return {
          ...acc,
          [group.id]: new FormControl(activeOption && activeOption.value),
        };
      }, {})
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
