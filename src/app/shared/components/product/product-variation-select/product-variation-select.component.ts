import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UUID } from 'angular2-uuid';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { VariationOptionGroup } from 'ish-core/models/product-variation/variation-option-group.model';
import { VariationSelection } from 'ish-core/models/product-variation/variation-selection.model';

@Component({
  selector: 'ish-product-variation-select',
  templateUrl: './product-variation-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductVariationSelectComponent implements OnChanges, OnDestroy {
  @Input() readOnly = false;
  @Input() variationOptions: VariationOptionGroup[] = [];
  @Input() productMasterSKU: string;
  @Output() selectVariation = new EventEmitter<VariationSelection>();

  form: FormGroup;
  advancedVariationHandling: boolean;
  uuid = UUID.UUID();

  private destroy$ = new Subject();

  constructor(featureToggleService: FeatureToggleService) {
    this.advancedVariationHandling = featureToggleService.enabled('advancedVariationHandling');
  }

  ngOnChanges() {
    this.initForm();
  }

  initForm() {
    if (this.variationOptions) {
      this.form = this.buildSelectForm(this.variationOptions);
      this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(this.selectVariation);
    }
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
  }
}
