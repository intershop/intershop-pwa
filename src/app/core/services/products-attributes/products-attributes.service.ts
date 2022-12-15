import { Injectable, InjectionToken, Injector } from '@angular/core';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';

/**
 * Type of products attributes.
 */
export enum ProductAttributeScope {
  /**
   * All availables attributes from the application
   */
  ALL,
  /**
   * Attributes that should be diplayed on product listing
   */
  LIST,
}

/**
 * Provider to declare additionnals production attributes on extensions
 */
export interface AdditionnalsProductAttributesProvider {
  /**
   * Fetch additionnals attributes when the product will be fetch with the REST API
   *
   * @returns A list of attributes name
   * @param scope Type of products attributes
   */
  getAdditionnalsAttributes(scope: ProductAttributeScope): string[];

  feature?: string;
}

/**
 * Main declaration of the product attribute provider.
 * 'additionnalsProductAttributesProvider' as internal id
 */
export const ADDITIONNALS_PRODUCT_ATTRIBUTES_PROVIDER = new InjectionToken<AdditionnalsProductAttributesProvider>(
  'additionnalsProductAttributesProvider'
);

/**
 * All attributes that can be fetched (currently retreived on product page)
 */
const DEFAULT_ALL_ATTRIBUTES = [
  'productName',
  'shortDescription',
  'longDescription',
  'sku',
  'availability',
  'retailSet',
  'inStock',
  'availableStock',
  'productMaster',
  'productMasterSKU',
  'mastered',
  'shippingMethods',
  'reviews',
  'roundedAverageRating',
  'readyForShipmentMin',
  'readyForShipmentMax',
  'minOrderQuantity',
  'variationAttributeValues',
  'productBundle',
  'manufacturer',
  'listPrice',
  'salePrice',
  'images',
  'defaultCategory',
  'attachments',
  'variations',
  'crosssells',
  'variableVariationAttributes',
  'bundles',
  'partOfRetailSet',
  'price',
  'minListPrice',
  'maxListPrice',
  'minSalePrice',
  'maxSalePrice',
  'summedUpListPrice',
  'summedUpSalePrice',
  'availableWarranties',
  'availableGiftWraps',
  'availableGiftMessages',
  'endOfLife',
  'lastOrderDate',
  'maxOrderQuantity',
  'stepOrderQuantity',
  'currencyCode',
  'sku',
  'name',
  'attributeGroups',
  'productTypes',
  'packingUnit',
  'promotions',
  'supplierSKU',
];

/**
 * All attributes that can be fetched on product listing page
 */
const DEFAULT_LIST_ATTRIBUTES = [
  'sku',
  'availability',
  'manufacturer',
  'image',
  'minOrderQuantity',
  'maxOrderQuantity',
  'stepOrderQuantity',
  'inStock',
  'promotions',
  'packingUnit',
  'mastered',
  'productMaster',
  'productMasterSKU',
  'roundedAverageRating',
  'retailSet',
  'defaultCategory',
];

/**
 * The Products Attributes Service handles attributes fetched with the 'products' REST API.
 */
@Injectable({ providedIn: 'root' })
export class ProductsAttributesService {
  private allAttributes: string;
  private listAttributes: string;

  constructor(private injector: Injector, private featureToggleService: FeatureToggleService) {
    const externalProvider = this.injector
      .get<AdditionnalsProductAttributesProvider[]>(ADDITIONNALS_PRODUCT_ATTRIBUTES_PROVIDER, [])
      .filter(p => (p.feature ? this.featureToggleService.enabled(p.feature) : true));

    this.allAttributes = this.compactAttributesList(
      DEFAULT_ALL_ATTRIBUTES,
      this.getAdditionnalAttributes(externalProvider, ProductAttributeScope.ALL)
    );
    this.listAttributes = this.compactAttributesList(
      DEFAULT_LIST_ATTRIBUTES,
      this.getAdditionnalAttributes(externalProvider, ProductAttributeScope.LIST)
    );
  }

  private compactAttributesList(defaultAttributes: string[], additionnalsAttributes: string[]) {
    const uniqAttrs = new Set<string>([...defaultAttributes, ...additionnalsAttributes]);
    return [...uniqAttrs].sort().join(',');
  }

  private getAdditionnalAttributes(providers: AdditionnalsProductAttributesProvider[], scope: ProductAttributeScope) {
    return providers.reduce((prev, current) => [...prev, ...current.getAdditionnalsAttributes(scope)], []);
  }

  /**
   * Get the list of attributes to fetch from a given scope
   *
   * @param scope Type of products attributes
   * @returns All attribute names joined by a comma
   */
  getAttributes(scope?: ProductAttributeScope): string {
    switch (scope) {
      case ProductAttributeScope.LIST:
        return this.listAttributes;
      default:
        return this.allAttributes;
    }
  }
}
