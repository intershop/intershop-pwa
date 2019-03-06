import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { VariationProductMaster } from 'ish-core/models/product/product-variation-master.model';
import { VariationProduct } from 'ish-core/models/product/product-variation.model';
import { Product, ProductHelper } from 'ish-core/models/product/product.model';
import { VariationAttribute } from 'ish-core/models/variation-attribute/variation-attribute.model';
import { VariationLink } from 'ish-core/models/variation-link/variation-link.model';
import { groupBy, objectToArray } from 'ish-core/utils/functions';

export interface SelectOption {
  label: string;
  value: string;
  type: string;
  alternativeCombination?: boolean;
}

interface AttributeOptionGroup {
  options: SelectOption[];
  label: string;
  id: string;
}

@Component({
  selector: 'ish-product-variations',
  templateUrl: './product-variations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductVariationsComponent implements OnChanges, OnDestroy {
  @Input() product: Product;
  @Input() masterProduct: VariationProductMaster;
  @Input() variations: VariationLink[];

  form: FormGroup;
  optionGroups: AttributeOptionGroup[];
  private destroy$ = new Subject();

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.form = new FormGroup({});
  }

  ngOnChanges() {
    this.setUpOptionsAndForm();
  }

  setUpOptionsAndForm() {
    if (this.product && this.masterProduct && this.variations) {
      if (ProductHelper.isMasterProduct(this.product)) {
        this.defaultProductRedirect();
        return;
      }

      this.optionGroups = this.buildOptionGroups(this.masterProduct, this.product);
      this.form = this.buildSelectForm(this.optionGroups);

      if (ProductHelper.isVariationProduct(this.product)) {
        this.preselectProductAttributes(this.product, this.form);
      }

      this.destroy$.next();

      this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(values => {
        this.variantRedirect(values);
      });
    }
  }

  /**
   * Build select value structure
   */
  buildOptionGroups(masterProduct: VariationProductMaster, product: Product): AttributeOptionGroup[] {
    const options: SelectOption[] = masterProduct.variationAttributeValues
      .map(attr => ({
        label: attr.value,
        value: attr.value,
        type: attr.variationAttributeId,
      }))
      .map(option => ({
        ...option,
        alternativeCombination: this.alternativeCombinationCheck(option, product as VariationProduct),
      }));

    const groupedOptions = groupBy(options, option => option.type);

    return Object.keys(groupedOptions).map(attrId => {
      const attribute = masterProduct.variationAttributeValues.find(a => a.variationAttributeId === attrId);
      return {
        id: attribute.variationAttributeId,
        label: attribute.name,
        options: groupedOptions[attrId],
      };
    });
  }

  /**
   * Build the product variations select form.
   */
  buildSelectForm(optionGroups: AttributeOptionGroup[]): FormGroup {
    return new FormGroup(optionGroups.reduce((acc, group) => ({ ...acc, [group.id]: new FormControl() }), {}));
  }

  /**
   * Preselect form selects with valid product variation attributes
   */
  preselectProductAttributes(product: VariationProduct, form: FormGroup) {
    product.variableVariationAttributes.forEach(attr => form.get(attr.variationAttributeId).setValue(attr.value));
  }

  /**
   * Redirect to default product if master product is selected.
   */
  defaultProductRedirect() {
    const defaultVariation = this.variations.find(
      variation =>
        variation.attributes &&
        variation.attributes[0] &&
        variation.attributes[0].name === 'defaultVariation' &&
        variation.attributes[0].value === true
    );

    if (defaultVariation) {
      const sku = this.getSku(defaultVariation.uri);
      this.router.navigate(['/product', sku]);
    }
  }

  /**
   * Find possible variant match and redirect.
   * @param values The selected variant form values.
   */
  variantRedirect(values: {}) {
    const valueArray = objectToArray(values);
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
  alternativeCombinationCheck(option: SelectOption, product: VariationProduct) {
    let quality: number;
    const selectedProductAttributes: VariationAttribute[] = [];
    const perfectMatchQuality = product.variableVariationAttributes.length;

    // remove option related attribute type since it should not be involved in combination check.
    for (const attribute of product.variableVariationAttributes) {
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
