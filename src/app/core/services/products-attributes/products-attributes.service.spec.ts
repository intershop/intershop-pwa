import { TestBed } from '@angular/core/testing';
import { instance, mock, when } from 'ts-mockito';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';

import {
  AdditionnalsProductAttributesProvider,
  ADDITIONNALS_PRODUCT_ATTRIBUTES_PROVIDER,
  ProductAttributeScope,
  ProductsAttributesService,
} from './products-attributes.service';

describe('Products Attributes Service', () => {
  let productsAttributesService: ProductsAttributesService;
  let featureToggleService: FeatureToggleService;

  describe('without product attributes providers', () => {
    beforeEach(() => {
      featureToggleService = mock(FeatureToggleService);
      TestBed.configureTestingModule({
        providers: [{ provide: FeatureToggleService, useFactory: () => instance(featureToggleService) }],
      });

      productsAttributesService = TestBed.inject(ProductsAttributesService);
    });

    it("should get default data when 'getAttributes(ProductAttributeScope.ALL)' is called", () => {
      expect(productsAttributesService.getAttributes(ProductAttributeScope.ALL)).toMatchInlineSnapshot(
        `"attachments,attributeGroups,availability,availableGiftMessages,availableGiftWraps,availableStock,availableWarranties,bundles,crosssells,currencyCode,defaultCategory,endOfLife,images,inStock,lastOrderDate,listPrice,longDescription,manufacturer,mastered,maxListPrice,maxOrderQuantity,maxSalePrice,minListPrice,minOrderQuantity,minSalePrice,name,packingUnit,partOfRetailSet,price,productBundle,productMaster,productMasterSKU,productName,productTypes,promotions,readyForShipmentMax,readyForShipmentMin,retailSet,reviews,roundedAverageRating,salePrice,shippingMethods,shortDescription,sku,stepOrderQuantity,summedUpListPrice,summedUpSalePrice,supplierSKU,variableVariationAttributes,variationAttributeValues,variations"`
      );
    });

    it("should get default data when 'getAttributes()' is called without parameters", () => {
      expect(productsAttributesService.getAttributes()).toMatchInlineSnapshot(
        `"attachments,attributeGroups,availability,availableGiftMessages,availableGiftWraps,availableStock,availableWarranties,bundles,crosssells,currencyCode,defaultCategory,endOfLife,images,inStock,lastOrderDate,listPrice,longDescription,manufacturer,mastered,maxListPrice,maxOrderQuantity,maxSalePrice,minListPrice,minOrderQuantity,minSalePrice,name,packingUnit,partOfRetailSet,price,productBundle,productMaster,productMasterSKU,productName,productTypes,promotions,readyForShipmentMax,readyForShipmentMin,retailSet,reviews,roundedAverageRating,salePrice,shippingMethods,shortDescription,sku,stepOrderQuantity,summedUpListPrice,summedUpSalePrice,supplierSKU,variableVariationAttributes,variationAttributeValues,variations"`
      );
    });

    it("should get default list data when 'getAttributes(ProductAttributeScope.LIST)' is called", () => {
      expect(productsAttributesService.getAttributes(ProductAttributeScope.LIST)).toMatchInlineSnapshot(
        `"availability,defaultCategory,image,inStock,manufacturer,mastered,maxOrderQuantity,minOrderQuantity,packingUnit,productMaster,productMasterSKU,promotions,retailSet,roundedAverageRating,sku,stepOrderQuantity"`
      );
    });
  });

  describe('with product attributes providers', () => {
    class ProviderUniqValue implements AdditionnalsProductAttributesProvider {
      getAdditionnalsAttributes(_scope: ProductAttributeScope): string[] {
        return ['A'];
      }
    }

    class ProviderMultipleValue implements AdditionnalsProductAttributesProvider {
      getAdditionnalsAttributes(_scope: ProductAttributeScope): string[] {
        return ['B', 'C'];
      }
    }

    class ProviderRepeatValue implements AdditionnalsProductAttributesProvider {
      getAdditionnalsAttributes(_scope: ProductAttributeScope): string[] {
        return ['C', 'B', 'A'];
      }
    }

    class ProviderListValue implements AdditionnalsProductAttributesProvider {
      getAdditionnalsAttributes(scope: ProductAttributeScope): string[] {
        switch (scope) {
          case ProductAttributeScope.LIST:
            return ['LIST1', 'LIST2'];
          default:
            return [];
        }
      }
    }

    beforeEach(() => {
      featureToggleService = mock(FeatureToggleService);
      TestBed.configureTestingModule({
        providers: [
          { provide: ADDITIONNALS_PRODUCT_ATTRIBUTES_PROVIDER, useClass: ProviderListValue, multi: true },
          { provide: ADDITIONNALS_PRODUCT_ATTRIBUTES_PROVIDER, useClass: ProviderMultipleValue, multi: true },
          { provide: ADDITIONNALS_PRODUCT_ATTRIBUTES_PROVIDER, useClass: ProviderRepeatValue, multi: true },
          { provide: ADDITIONNALS_PRODUCT_ATTRIBUTES_PROVIDER, useClass: ProviderUniqValue, multi: true },
          { provide: FeatureToggleService, useFactory: () => instance(featureToggleService) },
        ],
      });

      productsAttributesService = TestBed.inject(ProductsAttributesService);
    });

    it("should get extra data when 'getAttributes(ProductAttributeScope.ALL)' is called", () => {
      expect(productsAttributesService.getAttributes(ProductAttributeScope.ALL)).toMatchInlineSnapshot(
        `"A,B,C,attachments,attributeGroups,availability,availableGiftMessages,availableGiftWraps,availableStock,availableWarranties,bundles,crosssells,currencyCode,defaultCategory,endOfLife,images,inStock,lastOrderDate,listPrice,longDescription,manufacturer,mastered,maxListPrice,maxOrderQuantity,maxSalePrice,minListPrice,minOrderQuantity,minSalePrice,name,packingUnit,partOfRetailSet,price,productBundle,productMaster,productMasterSKU,productName,productTypes,promotions,readyForShipmentMax,readyForShipmentMin,retailSet,reviews,roundedAverageRating,salePrice,shippingMethods,shortDescription,sku,stepOrderQuantity,summedUpListPrice,summedUpSalePrice,supplierSKU,variableVariationAttributes,variationAttributeValues,variations"`
      );
    });

    it("should get extra data when 'getAttributes()' is called without parameters", () => {
      expect(productsAttributesService.getAttributes()).toMatchInlineSnapshot(
        `"A,B,C,attachments,attributeGroups,availability,availableGiftMessages,availableGiftWraps,availableStock,availableWarranties,bundles,crosssells,currencyCode,defaultCategory,endOfLife,images,inStock,lastOrderDate,listPrice,longDescription,manufacturer,mastered,maxListPrice,maxOrderQuantity,maxSalePrice,minListPrice,minOrderQuantity,minSalePrice,name,packingUnit,partOfRetailSet,price,productBundle,productMaster,productMasterSKU,productName,productTypes,promotions,readyForShipmentMax,readyForShipmentMin,retailSet,reviews,roundedAverageRating,salePrice,shippingMethods,shortDescription,sku,stepOrderQuantity,summedUpListPrice,summedUpSalePrice,supplierSKU,variableVariationAttributes,variationAttributeValues,variations"`
      );
    });

    it("should get extra list data when 'getAttributes(ProductAttributeScope.LIST)' is called", () => {
      expect(productsAttributesService.getAttributes(ProductAttributeScope.LIST)).toMatchInlineSnapshot(
        `"A,B,C,LIST1,LIST2,availability,defaultCategory,image,inStock,manufacturer,mastered,maxOrderQuantity,minOrderQuantity,packingUnit,productMaster,productMasterSKU,promotions,retailSet,roundedAverageRating,sku,stepOrderQuantity"`
      );
    });
  });

  describe('with featured scope product attributes providers', () => {
    class ProviderUniqValue implements AdditionnalsProductAttributesProvider {
      feature = 'A';
      getAdditionnalsAttributes(_scope: ProductAttributeScope): string[] {
        return ['A'];
      }
    }

    class ProviderMultipleValue implements AdditionnalsProductAttributesProvider {
      feature = 'B';
      getAdditionnalsAttributes(_scope: ProductAttributeScope): string[] {
        return ['B', 'C'];
      }
    }

    class ProviderRepeatValue implements AdditionnalsProductAttributesProvider {
      feature = 'C';
      getAdditionnalsAttributes(_scope: ProductAttributeScope): string[] {
        return ['C', 'B', 'A'];
      }
    }

    class ProviderListValue implements AdditionnalsProductAttributesProvider {
      feature = 'A';
      getAdditionnalsAttributes(scope: ProductAttributeScope): string[] {
        switch (scope) {
          case ProductAttributeScope.LIST:
            return ['LIST1', 'LIST2'];
          default:
            return [];
        }
      }
    }
    describe('and feature A activated', () => {
      beforeEach(() => {
        featureToggleService = mock(FeatureToggleService);
        when(featureToggleService.enabled('A')).thenReturn(true);

        TestBed.configureTestingModule({
          providers: [
            { provide: ADDITIONNALS_PRODUCT_ATTRIBUTES_PROVIDER, useClass: ProviderListValue, multi: true },
            { provide: ADDITIONNALS_PRODUCT_ATTRIBUTES_PROVIDER, useClass: ProviderMultipleValue, multi: true },
            { provide: ADDITIONNALS_PRODUCT_ATTRIBUTES_PROVIDER, useClass: ProviderRepeatValue, multi: true },
            { provide: ADDITIONNALS_PRODUCT_ATTRIBUTES_PROVIDER, useClass: ProviderUniqValue, multi: true },
            { provide: FeatureToggleService, useFactory: () => instance(featureToggleService) },
          ],
        });
        productsAttributesService = TestBed.inject(ProductsAttributesService);
      });

      it("should get extra data when 'getAttributes(ProductAttributeScope.ALL)' is called", () => {
        expect(productsAttributesService.getAttributes(ProductAttributeScope.ALL)).toMatchInlineSnapshot(
          `"A,attachments,attributeGroups,availability,availableGiftMessages,availableGiftWraps,availableStock,availableWarranties,bundles,crosssells,currencyCode,defaultCategory,endOfLife,images,inStock,lastOrderDate,listPrice,longDescription,manufacturer,mastered,maxListPrice,maxOrderQuantity,maxSalePrice,minListPrice,minOrderQuantity,minSalePrice,name,packingUnit,partOfRetailSet,price,productBundle,productMaster,productMasterSKU,productName,productTypes,promotions,readyForShipmentMax,readyForShipmentMin,retailSet,reviews,roundedAverageRating,salePrice,shippingMethods,shortDescription,sku,stepOrderQuantity,summedUpListPrice,summedUpSalePrice,supplierSKU,variableVariationAttributes,variationAttributeValues,variations"`
        );
      });

      it("should get extra data when 'getAttributes()' is called without parameters", () => {
        expect(productsAttributesService.getAttributes()).toMatchInlineSnapshot(
          `"A,attachments,attributeGroups,availability,availableGiftMessages,availableGiftWraps,availableStock,availableWarranties,bundles,crosssells,currencyCode,defaultCategory,endOfLife,images,inStock,lastOrderDate,listPrice,longDescription,manufacturer,mastered,maxListPrice,maxOrderQuantity,maxSalePrice,minListPrice,minOrderQuantity,minSalePrice,name,packingUnit,partOfRetailSet,price,productBundle,productMaster,productMasterSKU,productName,productTypes,promotions,readyForShipmentMax,readyForShipmentMin,retailSet,reviews,roundedAverageRating,salePrice,shippingMethods,shortDescription,sku,stepOrderQuantity,summedUpListPrice,summedUpSalePrice,supplierSKU,variableVariationAttributes,variationAttributeValues,variations"`
        );
      });

      it("should get extra list data when 'getAttributes(ProductAttributeScope.LIST)' is called", () => {
        expect(productsAttributesService.getAttributes(ProductAttributeScope.LIST)).toMatchInlineSnapshot(
          `"A,LIST1,LIST2,availability,defaultCategory,image,inStock,manufacturer,mastered,maxOrderQuantity,minOrderQuantity,packingUnit,productMaster,productMasterSKU,promotions,retailSet,roundedAverageRating,sku,stepOrderQuantity"`
        );
      });
    });

    describe('and feature B activated', () => {
      beforeEach(() => {
        featureToggleService = mock(FeatureToggleService);
        when(featureToggleService.enabled('B')).thenReturn(true);

        TestBed.configureTestingModule({
          providers: [
            { provide: ADDITIONNALS_PRODUCT_ATTRIBUTES_PROVIDER, useClass: ProviderListValue, multi: true },
            { provide: ADDITIONNALS_PRODUCT_ATTRIBUTES_PROVIDER, useClass: ProviderMultipleValue, multi: true },
            { provide: ADDITIONNALS_PRODUCT_ATTRIBUTES_PROVIDER, useClass: ProviderRepeatValue, multi: true },
            { provide: ADDITIONNALS_PRODUCT_ATTRIBUTES_PROVIDER, useClass: ProviderUniqValue, multi: true },
            { provide: FeatureToggleService, useFactory: () => instance(featureToggleService) },
          ],
        });
        productsAttributesService = TestBed.inject(ProductsAttributesService);
      });

      it("should get extra data when 'getAttributes(ProductAttributeScope.ALL)' is called", () => {
        expect(productsAttributesService.getAttributes(ProductAttributeScope.ALL)).toMatchInlineSnapshot(
          `"B,C,attachments,attributeGroups,availability,availableGiftMessages,availableGiftWraps,availableStock,availableWarranties,bundles,crosssells,currencyCode,defaultCategory,endOfLife,images,inStock,lastOrderDate,listPrice,longDescription,manufacturer,mastered,maxListPrice,maxOrderQuantity,maxSalePrice,minListPrice,minOrderQuantity,minSalePrice,name,packingUnit,partOfRetailSet,price,productBundle,productMaster,productMasterSKU,productName,productTypes,promotions,readyForShipmentMax,readyForShipmentMin,retailSet,reviews,roundedAverageRating,salePrice,shippingMethods,shortDescription,sku,stepOrderQuantity,summedUpListPrice,summedUpSalePrice,supplierSKU,variableVariationAttributes,variationAttributeValues,variations"`
        );
      });

      it("should get extra data when 'getAttributes()' is called without parameters", () => {
        expect(productsAttributesService.getAttributes()).toMatchInlineSnapshot(
          `"B,C,attachments,attributeGroups,availability,availableGiftMessages,availableGiftWraps,availableStock,availableWarranties,bundles,crosssells,currencyCode,defaultCategory,endOfLife,images,inStock,lastOrderDate,listPrice,longDescription,manufacturer,mastered,maxListPrice,maxOrderQuantity,maxSalePrice,minListPrice,minOrderQuantity,minSalePrice,name,packingUnit,partOfRetailSet,price,productBundle,productMaster,productMasterSKU,productName,productTypes,promotions,readyForShipmentMax,readyForShipmentMin,retailSet,reviews,roundedAverageRating,salePrice,shippingMethods,shortDescription,sku,stepOrderQuantity,summedUpListPrice,summedUpSalePrice,supplierSKU,variableVariationAttributes,variationAttributeValues,variations"`
        );
      });

      it("should get extra list data when 'getAttributes(ProductAttributeScope.LIST)' is called", () => {
        expect(productsAttributesService.getAttributes(ProductAttributeScope.LIST)).toMatchInlineSnapshot(
          `"B,C,availability,defaultCategory,image,inStock,manufacturer,mastered,maxOrderQuantity,minOrderQuantity,packingUnit,productMaster,productMasterSKU,promotions,retailSet,roundedAverageRating,sku,stepOrderQuantity"`
        );
      });
    });

    describe('and feature C activated', () => {
      beforeEach(() => {
        featureToggleService = mock(FeatureToggleService);
        when(featureToggleService.enabled('C')).thenReturn(true);

        TestBed.configureTestingModule({
          providers: [
            { provide: ADDITIONNALS_PRODUCT_ATTRIBUTES_PROVIDER, useClass: ProviderListValue, multi: true },
            { provide: ADDITIONNALS_PRODUCT_ATTRIBUTES_PROVIDER, useClass: ProviderMultipleValue, multi: true },
            { provide: ADDITIONNALS_PRODUCT_ATTRIBUTES_PROVIDER, useClass: ProviderRepeatValue, multi: true },
            { provide: ADDITIONNALS_PRODUCT_ATTRIBUTES_PROVIDER, useClass: ProviderUniqValue, multi: true },
            { provide: FeatureToggleService, useFactory: () => instance(featureToggleService) },
          ],
        });
        productsAttributesService = TestBed.inject(ProductsAttributesService);
      });

      it("should get extra data when 'getAttributes(ProductAttributeScope.ALL)' is called", () => {
        expect(productsAttributesService.getAttributes(ProductAttributeScope.ALL)).toMatchInlineSnapshot(
          `"A,B,C,attachments,attributeGroups,availability,availableGiftMessages,availableGiftWraps,availableStock,availableWarranties,bundles,crosssells,currencyCode,defaultCategory,endOfLife,images,inStock,lastOrderDate,listPrice,longDescription,manufacturer,mastered,maxListPrice,maxOrderQuantity,maxSalePrice,minListPrice,minOrderQuantity,minSalePrice,name,packingUnit,partOfRetailSet,price,productBundle,productMaster,productMasterSKU,productName,productTypes,promotions,readyForShipmentMax,readyForShipmentMin,retailSet,reviews,roundedAverageRating,salePrice,shippingMethods,shortDescription,sku,stepOrderQuantity,summedUpListPrice,summedUpSalePrice,supplierSKU,variableVariationAttributes,variationAttributeValues,variations"`
        );
      });

      it("should get extra data when 'getAttributes()' is called without parameters", () => {
        expect(productsAttributesService.getAttributes()).toMatchInlineSnapshot(
          `"A,B,C,attachments,attributeGroups,availability,availableGiftMessages,availableGiftWraps,availableStock,availableWarranties,bundles,crosssells,currencyCode,defaultCategory,endOfLife,images,inStock,lastOrderDate,listPrice,longDescription,manufacturer,mastered,maxListPrice,maxOrderQuantity,maxSalePrice,minListPrice,minOrderQuantity,minSalePrice,name,packingUnit,partOfRetailSet,price,productBundle,productMaster,productMasterSKU,productName,productTypes,promotions,readyForShipmentMax,readyForShipmentMin,retailSet,reviews,roundedAverageRating,salePrice,shippingMethods,shortDescription,sku,stepOrderQuantity,summedUpListPrice,summedUpSalePrice,supplierSKU,variableVariationAttributes,variationAttributeValues,variations"`
        );
      });

      it("should get extra list data when 'getAttributes(ProductAttributeScope.LIST)' is called", () => {
        expect(productsAttributesService.getAttributes(ProductAttributeScope.LIST)).toMatchInlineSnapshot(
          `"A,B,C,availability,defaultCategory,image,inStock,manufacturer,mastered,maxOrderQuantity,minOrderQuantity,packingUnit,productMaster,productMasterSKU,promotions,retailSet,roundedAverageRating,sku,stepOrderQuantity"`
        );
      });
    });

    describe('and feature A,B,C activated', () => {
      beforeEach(() => {
        featureToggleService = mock(FeatureToggleService);
        when(featureToggleService.enabled('A')).thenReturn(true);
        when(featureToggleService.enabled('B')).thenReturn(true);
        when(featureToggleService.enabled('C')).thenReturn(true);

        TestBed.configureTestingModule({
          providers: [
            { provide: ADDITIONNALS_PRODUCT_ATTRIBUTES_PROVIDER, useClass: ProviderListValue, multi: true },
            { provide: ADDITIONNALS_PRODUCT_ATTRIBUTES_PROVIDER, useClass: ProviderMultipleValue, multi: true },
            { provide: ADDITIONNALS_PRODUCT_ATTRIBUTES_PROVIDER, useClass: ProviderRepeatValue, multi: true },
            { provide: ADDITIONNALS_PRODUCT_ATTRIBUTES_PROVIDER, useClass: ProviderUniqValue, multi: true },
            { provide: FeatureToggleService, useFactory: () => instance(featureToggleService) },
          ],
        });
        productsAttributesService = TestBed.inject(ProductsAttributesService);
      });

      it("should get extra data when 'getAttributes(ProductAttributeScope.ALL)' is called", () => {
        expect(productsAttributesService.getAttributes(ProductAttributeScope.ALL)).toMatchInlineSnapshot(
          `"A,B,C,attachments,attributeGroups,availability,availableGiftMessages,availableGiftWraps,availableStock,availableWarranties,bundles,crosssells,currencyCode,defaultCategory,endOfLife,images,inStock,lastOrderDate,listPrice,longDescription,manufacturer,mastered,maxListPrice,maxOrderQuantity,maxSalePrice,minListPrice,minOrderQuantity,minSalePrice,name,packingUnit,partOfRetailSet,price,productBundle,productMaster,productMasterSKU,productName,productTypes,promotions,readyForShipmentMax,readyForShipmentMin,retailSet,reviews,roundedAverageRating,salePrice,shippingMethods,shortDescription,sku,stepOrderQuantity,summedUpListPrice,summedUpSalePrice,supplierSKU,variableVariationAttributes,variationAttributeValues,variations"`
        );
      });

      it("should get extra data when 'getAttributes()' is called without parameters", () => {
        expect(productsAttributesService.getAttributes()).toMatchInlineSnapshot(
          `"A,B,C,attachments,attributeGroups,availability,availableGiftMessages,availableGiftWraps,availableStock,availableWarranties,bundles,crosssells,currencyCode,defaultCategory,endOfLife,images,inStock,lastOrderDate,listPrice,longDescription,manufacturer,mastered,maxListPrice,maxOrderQuantity,maxSalePrice,minListPrice,minOrderQuantity,minSalePrice,name,packingUnit,partOfRetailSet,price,productBundle,productMaster,productMasterSKU,productName,productTypes,promotions,readyForShipmentMax,readyForShipmentMin,retailSet,reviews,roundedAverageRating,salePrice,shippingMethods,shortDescription,sku,stepOrderQuantity,summedUpListPrice,summedUpSalePrice,supplierSKU,variableVariationAttributes,variationAttributeValues,variations"`
        );
      });

      it("should get extra list data when 'getAttributes(ProductAttributeScope.LIST)' is called", () => {
        expect(productsAttributesService.getAttributes(ProductAttributeScope.LIST)).toMatchInlineSnapshot(
          `"A,B,C,LIST1,LIST2,availability,defaultCategory,image,inStock,manufacturer,mastered,maxOrderQuantity,minOrderQuantity,packingUnit,productMaster,productMasterSKU,promotions,retailSet,roundedAverageRating,sku,stepOrderQuantity"`
        );
      });
    });
  });
});
