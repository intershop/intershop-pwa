import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { VariationProductMaster } from 'ish-core/models/product/product-variation-master.model';
import { VariationProduct } from 'ish-core/models/product/product-variation.model';
import { Product, ProductType } from 'ish-core/models/product/product.model';
import { VariationAttribute } from 'ish-core/models/variation-attribute/variation-attribute.model';
import { VariationLink } from 'ish-core/models/variation-link/variation-link.model';

export interface SelectOption {
  label: string;
  value: string;
  type: string;
  alternativeCombination?: boolean;
}

@Component({
  selector: 'ish-product-variations',
  templateUrl: './product-variations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductVariationsComponent implements OnChanges, OnDestroy {
  @Input()
  product: Product;
  @Input()
  masterProduct: VariationProductMaster;
  @Input()
  variations: VariationLink[];

  selectOptions: {};
  form: FormGroup;
  controlMetaItems: { id: string; label: string }[] = [];
  private destroy$ = new Subject();

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.form = new FormGroup({});
  }

  ngOnChanges() {
    if (this.product && this.masterProduct && this.variations) {
      if (this.product.type === ProductType.VariationProductMaster) {
        this.defaultProductRedirect();
        return;
      }

      this.buildSelectOptions();
      this.buildSelectForm();

      if (this.product.type === ProductType.VariationProduct) {
        this.preselectProductAttributes();
      }

      this.destroy$.next();

      this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(values => {
        this.variantRedirect(values);
      });
    }
  }

  /**
   * Build possible select value structure.
   */
  buildSelectOptions() {
    const selectOptions = {};

    for (const attribute of this.masterProduct.variationAttributeValues) {
      if (!selectOptions[attribute.variationAttributeId]) {
        selectOptions[attribute.variationAttributeId] = [];
      }

      selectOptions[attribute.variationAttributeId].push({
        label: attribute.value,
        value: attribute.value,
        type: attribute.variationAttributeId,
      });
    }

    // add alternative combination flag
    for (const key in selectOptions) {
      if (selectOptions.hasOwnProperty(key)) {
        for (const option of selectOptions[key]) {
          option.alternativeCombination = this.alternativeCombinationCheck(option);
        }
      }
    }

    this.selectOptions = selectOptions;
  }

  /**
   * Build the product variations select form.
   */
  buildSelectForm() {
    const items = {};
    const controlMetaItems: { id: string; label: string }[] = [];

    for (const attribute of this.masterProduct.variationAttributeValues) {
      if (!items[attribute.variationAttributeId]) {
        items[attribute.variationAttributeId] = new FormControl(undefined);

        // Build an array of control meta items for select component rendering.
        controlMetaItems.push({ id: attribute.variationAttributeId, label: attribute.name });
      }
    }

    this.controlMetaItems = controlMetaItems;
    this.form = this.formBuilder.group(items);
  }

  /**
   * Preselect form selects with valid product variation attributes
   */
  preselectProductAttributes() {
    for (const attribute of (this.product as VariationProduct).variableVariationAttributes) {
      this.form.controls[attribute.variationAttributeId].patchValue(attribute.value);
    }
  }

  /**
   * Redirect to default product if master product is selected.
   */
  defaultProductRedirect() {
    let defaultVariation: VariationLink;

    for (const variation of this.variations) {
      if (
        variation.attributes &&
        variation.attributes[0] &&
        variation.attributes[0].name === 'defaultVariation' &&
        variation.attributes[0].value === true
      ) {
        defaultVariation = variation;
        break;
      }
    }

    if (defaultVariation) {
      const sku = this.getSku(defaultVariation.uri);
      this.router.navigate([`/product/${sku}`]);
    }
  }

  /**
   * Find possible variant match and redirect.
   * @param values The selected variant form values.
   */
  variantRedirect(values: {}) {
    const valueArray = this.convertValues(values);
    let possibleRedirectUri: string;

    for (const variation of this.variations) {
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
        const sku = this.getSku(variation.uri);
        this.router.navigate([`/product/${sku}`]);
        return;
      }
      // store possible redirect uri (quality > 0)
      if (quality > 0 && !possibleRedirectUri) {
        possibleRedirectUri = variation.uri;
      }
    }

    // redirect if match quality > 0
    if (possibleRedirectUri) {
      const sku = this.getSku(possibleRedirectUri);
      this.router.navigate([`/product/${sku}`]);
    }
  }

  /**
   * Check specific option if perfect variant match is not existing.
   * @param option  The select option to check.
   * @returns       Indicates if no perfect match is found.
   */
  alternativeCombinationCheck(option: SelectOption) {
    let quality: number;
    const selectedProductAttributes: VariationAttribute[] = [];
    const perfectMatchQuality = (this.product as VariationProduct).variableVariationAttributes.length;

    // remove option related attribute type since it should not be involved in combination check.
    for (const attribute of (this.product as VariationProduct).variableVariationAttributes) {
      if (attribute.variationAttributeId !== option.type) {
        selectedProductAttributes.push(attribute);
      }
    }

    // loop all selected product attributes ignoring the ones related to currently checked option.
    for (const selectedAttribute of selectedProductAttributes) {
      // loop all possible variations
      for (const variation of this.variations) {
        quality = 0;

        // loop attributes of possible variation.
        for (const attribute of variation.variableVariationAttributeValues) {
          // increment quality if variation attribute matches selected product attribute.
          if (
            attribute.variationAttributeId === selectedAttribute.variationAttributeId &&
            attribute.value === selectedAttribute.value
          ) {
            quality += 1;
          }

          // increment quality if variation attribute matches currently checked option.
          if (attribute.variationAttributeId === option.type && attribute.value === option.value) {
            quality += 1;
          }
        }

        // perfect match found
        if (quality === perfectMatchQuality) {
          return false;
        }
      }
    }

    // imperfect match
    return true;
  }

  /**
   * Convert value associative array to real array.
   * @param values  The associative array.
   * @returns       The converted array.
   */
  convertValues(values: {}) {
    const valueArray: { key: string; value: string }[] = [];

    for (const key in values) {
      if (values.hasOwnProperty(key)) {
        valueArray.push({
          key,
          value: values[key],
        });
      }
    }

    return valueArray;
  }

  /**
   * Get product sku form URI.
   * @param uri The product URI.
   * @returns   The product SKU.
   */
  getSku(uri: string) {
    return uri.split('/').pop();
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
