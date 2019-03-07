import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

import { VariationProductView } from 'ish-core/models/product-view/product-view.model';
import { VariationLink } from 'ish-core/models/variation-link/variation-link.model';
import { VariationOptionGroup, VariationSelection } from 'ish-core/store/shopping/products';
import { objectToArray } from 'ish-core/utils/functions';

@Component({
  selector: 'ish-product-variations',
  templateUrl: './product-variations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductVariationsComponent implements OnChanges, OnDestroy {
  // @Input() product: VariationProductView | VariationProductMasterView;
  @Input() variationOptions: VariationOptionGroup[];
  @Output() selectVariation = new EventEmitter<VariationSelection>();

  form: FormGroup;
  private destroy$ = new Subject();

  constructor() {
    this.form = new FormGroup({});
  }

  ngOnChanges() {
    this.setUpOptionsAndForm();
  }

  setUpOptionsAndForm() {
    this.form = this.buildSelectForm(this.variationOptions);

    this.form.valueChanges.subscribe(this.selectVariation);
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

  /**
   * Find possible variant match and redirect.
   * @param values The selected variant form values.
   */
  selectVariationX(formValue: {}, product: VariationProductView): VariationLink {
    const valueArray = objectToArray(formValue);
    let possibleVariation: VariationLink;

    for (const variation of product.variations) {
      let quality = 0;

      for (const variationAttribute of variation.variableVariationAttributeValues) {
        // selected variant object loop
        for (const item of valueArray) {
          if (variationAttribute.variationAttributeId === item.key && variationAttribute.value === item.value) {
            quality += 1;
          }
        }
      }

      // redirect to perfect match
      if (quality === valueArray.length) {
        return variation;
      }
      // store possible redirect uri (quality > 0)
      if (quality > 0 && !possibleVariation) {
        possibleVariation = variation;
      }
    }

    // redirect if match quality > 0
    if (possibleVariation) {
      return possibleVariation;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
