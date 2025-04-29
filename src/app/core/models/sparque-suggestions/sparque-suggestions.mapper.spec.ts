import { TestBed } from '@angular/core/testing';
import { anything, mock, when } from 'ts-mockito';

import { Product } from 'ish-core/models/product/product.model';
import { SparqueOfferMapper } from 'ish-core/models/sparque-offer/sparque-offer.mapper';
import { SparqueProduct } from 'ish-core/models/sparque-product/sparque-product.interface';
import { SparqueProductMapper } from 'ish-core/models/sparque-product/sparque-product.mapper';
import { Suggestions } from 'ish-core/models/suggestions/suggestions.model';

import { SparqueSuggestions } from './sparque-suggestions.interface';
import { SparqueSuggestionsMapper } from './sparque-suggestions.mapper';

describe('Sparque Suggestions Mapper', () => {
  let sparqueSuggestionsMapper: SparqueSuggestionsMapper;
  let sparqueProductMapperMock: SparqueProductMapper;
  let sparqueOfferMapperMock: SparqueOfferMapper;

  const attributes = [{ name: 'Color', value: 'Red' }];
  const sparqueProduct = {
    name: 'Product 1',
    shortDescription: 'Short description',
    longDescription: 'Long description',
    manufacturer: 'Manufacturer',
    images: [],
    attributes,
    sku: 'SKU1',
    defaultcategoryId: 'cat1',
    offers: [
      {
        priceIncVat: 100,
        priceExclVat: 80,
        currency: 'USD',
      },
    ],
  } as SparqueProduct;

  const product = {
    name: sparqueProduct.name,
    shortDescription: sparqueProduct.shortDescription,
    longDescription: sparqueProduct.longDescription,
    available: true,
    manufacturer: sparqueProduct.manufacturer,
    images: anything(),
    attributes,
    sku: sparqueProduct.sku,
    defaultCategoryId: sparqueProduct.defaultcategoryId,
    completenessLevel: 0,
    maxOrderQuantity: anything(),
    minOrderQuantity: anything(),
    stepQuantity: anything(),
    roundedAverageRating: anything(),
    numberOfReviews: anything(),
    readyForShipmentMin: anything(),
    readyForShipmentMax: anything(),
    packingUnit: anything(),
    type: anything(),
    promotionIds: anything(),
    failed: false,
  } as Product;

  beforeEach(() => {
    sparqueProductMapperMock = mock(SparqueProductMapper);
    when(sparqueProductMapperMock.mapProducts(anything())).thenReturn([product]);
    sparqueOfferMapperMock = mock(SparqueOfferMapper);
    when(sparqueOfferMapperMock.mapOffers(anything())).thenReturn([
      {
        sku: product.sku,
        prices: {
          salePrice: { type: 'PriceItem', gross: 100, net: 80, currency: 'USD' },
          listPrice: { type: 'PriceItem', gross: 100, net: 80, currency: 'USD' },
        },
      },
    ]);

    TestBed.configureTestingModule({});
    sparqueSuggestionsMapper = TestBed.inject(SparqueSuggestionsMapper);
  });

  describe('fromData', () => {
    it('should map products correctly', () => {
      const sparqueSuggestions: SparqueSuggestions = {
        products: [sparqueProduct],
        categories: [],
        brands: [],
        keywordSuggestions: [],
      };

      const result: Suggestions = sparqueSuggestionsMapper.fromData(sparqueSuggestions);
      expect(result.products).toHaveLength(1);
      expect(result.products[0].name).toBe(sparqueProduct.name);
      expect(result.products[0].shortDescription).toBe(sparqueProduct.shortDescription);
      expect(result.products[0].longDescription).toBe(sparqueProduct.longDescription);
      expect(result.products[0].manufacturer).toBe(sparqueProduct.manufacturer);
      expect(result.products[0].attributes).toHaveLength(1);
      expect(result.products[0].attributes[0].name).toBe(sparqueProduct.attributes[0].name);
      expect(result.products[0].attributes[0].value).toBe(sparqueProduct.attributes[0].value);
      expect(result.products[0].sku).toBe(sparqueProduct.sku);
      expect(result.products[0].defaultCategoryId).toBe(sparqueProduct.defaultcategoryId);
    });

    it('should map categories correctly', () => {
      const sparqueSuggestions: SparqueSuggestions = {
        products: [],
        categories: [
          {
            categoryName: 'Category 1',
            categoryID: 'cat1',
            categoryURL: 'http://category.url',
            parentCategoryId: 'parentCat',
            totalCount: 10,
            attributes: [{ name: 'Type', value: 'Electronics' }],
          },
        ],
        brands: [],
        keywordSuggestions: [],
      };

      const result: Suggestions = sparqueSuggestionsMapper.fromData(sparqueSuggestions);

      expect(result.categories).toHaveLength(1);
      expect(result.categories[0].name).toBe(sparqueSuggestions.categories[0].categoryName);
      expect(result.categories[0].uniqueId).toBe('parentCat.cat1');
      expect(result.categories[0].categoryRef).toBe(sparqueSuggestions.categories[0].categoryURL);
      expect(result.categories[0].categoryPath).toEqual([
        sparqueSuggestions.categories[0].parentCategoryId,
        sparqueSuggestions.categories[0].categoryID,
      ]);
      expect(result.categories[0].hasOnlineProducts).toBeTrue();
      expect(result.categories[0].attributes).toHaveLength(1);
      expect(result.categories[0].attributes[0].name).toBe('Type');
      expect(result.categories[0].attributes[0].value).toBe('Electronics');
    });

    it('should map brands correctly', () => {
      const sparqueSuggestions: SparqueSuggestions = {
        products: [],
        categories: [],
        brands: [
          {
            brandName: 'Brand 1',
            totalCount: 5,
          },
        ],
        keywordSuggestions: [],
      };

      const result: Suggestions = sparqueSuggestionsMapper.fromData(sparqueSuggestions);

      expect(result.brands).toHaveLength(1);
      expect(result.brands[0].brandName).toBe(sparqueSuggestions.brands[0].brandName);
      expect(result.brands[0].totalCount).toBe(5);
    });

    it('should map keyword suggestions correctly', () => {
      const sparqueSuggestions: SparqueSuggestions = {
        products: [],
        categories: [],
        brands: [],
        keywordSuggestions: [{ keyword: 'keyword1' }, { keyword: 'keyword2' }],
      };

      const result: Suggestions = sparqueSuggestionsMapper.fromData(sparqueSuggestions);

      expect(result.keywords).toHaveLength(2);
      expect(result.keywords).toContain(sparqueSuggestions.keywordSuggestions[0].keyword);
      expect(result.keywords).toContain(sparqueSuggestions.keywordSuggestions[1].keyword);
    });

    it('should return empty object for undefined input', () => {
      const result: Suggestions = sparqueSuggestionsMapper.fromData(undefined);
      expect(result.brands).toBeEmpty();
      expect(result.categories).toBeEmpty();
      expect(result.keywords).toBeEmpty();
      expect(result.products).toBeEmpty();
      expect(result.prices).toBeEmpty();
    });
  });
});
