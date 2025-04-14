import { TestBed } from '@angular/core/testing';
import { anything, mock, when } from 'ts-mockito';

import { Product } from 'ish-core/models/product/product.model';
import { SparqueOfferMapper } from 'ish-core/models/sparque-offer/sparque-offer.mapper';
import { SparqueProduct } from 'ish-core/models/sparque-product/sparque-product.interface';
import { SparqueProductMapper } from 'ish-core/models/sparque-product/sparque-product.mapper';
import { Suggestion } from 'ish-core/models/suggestion/suggestion.model';

import { SparqueSuggestions } from './sparque-suggestion.interface';
import { SparqueSuggestionMapper } from './sparque-suggestion.mapper';

describe('Sparque Suggestion Mapper', () => {
  let sparqueSuggestionMapper: SparqueSuggestionMapper;
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
    sparqueSuggestionMapper = TestBed.inject(SparqueSuggestionMapper);
  });

  describe('fromData', () => {
    it('should map products correctly', () => {
      const sparqueSuggestions: SparqueSuggestions = {
        products: [sparqueProduct],
        categories: [],
        brands: [],
        keywordSuggestions: [],
        contentSuggestions: [],
      };

      const result: Suggestion = sparqueSuggestionMapper.fromData(sparqueSuggestions);
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
        contentSuggestions: [],
      };

      const result: Suggestion = sparqueSuggestionMapper.fromData(sparqueSuggestions);

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
        contentSuggestions: [],
      };

      const result: Suggestion = sparqueSuggestionMapper.fromData(sparqueSuggestions);

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
        contentSuggestions: [],
      };

      const result: Suggestion = sparqueSuggestionMapper.fromData(sparqueSuggestions);

      expect(result.keywordSuggestions).toHaveLength(2);
      expect(result.keywordSuggestions).toContain(sparqueSuggestions.keywordSuggestions[0].keyword);
      expect(result.keywordSuggestions).toContain(sparqueSuggestions.keywordSuggestions[1].keyword);
    });

    it('should map content suggestions correctly', () => {
      const date = new Date('2023-10-01');
      const sparqueSuggestions: SparqueSuggestions = {
        products: [],
        categories: [],
        brands: [],
        keywordSuggestions: [],
        contentSuggestions: [
          {
            newsType: 'News',
            paragraph: 'Paragraph',
            slug: 'slug',
            summary: 'Summary',
            title: 'Title',
            type: 'Type',
            articleDate: date,
          },
        ],
      };

      const result: Suggestion = sparqueSuggestionMapper.fromData(sparqueSuggestions);

      expect(result.contentSuggestions).toHaveLength(1);
      expect(result.contentSuggestions[0].newsType).toBe(sparqueSuggestions.contentSuggestions[0].newsType);
      expect(result.contentSuggestions[0].paragraph).toBe(sparqueSuggestions.contentSuggestions[0].paragraph);
      expect(result.contentSuggestions[0].slug).toBe(sparqueSuggestions.contentSuggestions[0].slug);
      expect(result.contentSuggestions[0].summary).toBe(sparqueSuggestions.contentSuggestions[0].summary);
      expect(result.contentSuggestions[0].title).toBe(sparqueSuggestions.contentSuggestions[0].title);
      expect(result.contentSuggestions[0].type).toBe(sparqueSuggestions.contentSuggestions[0].type);
      expect(result.contentSuggestions[0].articleDate).toBe(date);
    });

    it('should return empty object for undefined input', () => {
      const result: Suggestion = sparqueSuggestionMapper.fromData(undefined);
      expect(result.brands).toBeEmpty();
      expect(result.categories).toBeEmpty();
      expect(result.keywordSuggestions).toBeEmpty();
      expect(result.products).toBeEmpty();
      expect(result.contentSuggestions).toBeEmpty();
      expect(result.prices).toBeEmpty();
    });
  });
});
