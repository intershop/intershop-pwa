import { TestBed } from '@angular/core/testing';
import { anything, instance, mock, when } from 'ts-mockito';

import { Product } from 'ish-core/models/product/product.model';
import { SparqueOfferMapper } from 'ish-core/models/sparque-offer/sparque-offer.mapper';
import { SparqueProduct } from 'ish-core/models/sparque-product/sparque-product.interface';
import { SparqueProductMapper } from 'ish-core/models/sparque-product/sparque-product.mapper';
import { URLFormParams } from 'ish-core/utils/url-form-params';

import { FixedFacetGroupResult, SparqueSearchResponse, SparqueSortingOptionResponse } from './sparque-search.interface';
import { SparqueSearchMapper } from './sparque-search.mapper';

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

const searchParams: URLFormParams = { searchTerm: ['fancyProduct'] };

describe('Sparque Search Mapper', () => {
  let sparqueSearchMapper: SparqueSearchMapper;
  let sparqueProductMapperMock: SparqueProductMapper;
  let sparqueOfferMapperMock: SparqueOfferMapper;

  beforeEach(() => {
    sparqueProductMapperMock = mock(SparqueProductMapper);
    when(sparqueProductMapperMock.mapProducts(anything())).thenReturn([]);
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
    TestBed.configureTestingModule({
      providers: [{ provide: SparqueProductMapper, useFactory: () => instance(sparqueProductMapperMock) }],
    });

    sparqueSearchMapper = TestBed.inject(SparqueSearchMapper);
  });

  describe('fromData', () => {
    it('should map search response correctly', () => {
      when(sparqueProductMapperMock.mapProducts(anything())).thenReturn([product]);
      const sparqueSearchResonse: SparqueSearchResponse = {
        products: [sparqueProduct],
        total: 1,
        facets: [],
        sortings: [],
      };

      const result = sparqueSearchMapper.fromData(sparqueSearchResonse, searchParams);
      expect(result.products[0].name).toEqual(product.name);
      expect(result.products).toHaveLength(1);
      expect(result.total).toBe(sparqueSearchResonse.total);
      expect(result.filter).toBeEmpty();
      expect(result.filter).toBeEmpty();
    });

    it('should handle empty search response gracefully', () => {
      const searchResponse: SparqueSearchResponse = {
        products: [],
        sortings: [],
        total: 0,
        facets: [],
      };

      const result = sparqueSearchMapper.fromData(searchResponse, {});

      expect(result.products).toBeEmpty();
      expect(result.sortableAttributes).toBeEmpty();
      expect(result.total).toBe(0);
      expect(result.filter).toBeEmpty();
    });
  });

  describe('mapSortableAttributes', () => {
    it('should map sortable attributes correctly', () => {
      const sortings: SparqueSortingOptionResponse[] = [
        { identifier: 'price', title: 'Price' },
        { identifier: 'name', title: 'Name' },
      ];

      const searchResponse: SparqueSearchResponse = {
        products: [],
        sortings,
        total: 0,
        facets: [],
      };

      const result = sparqueSearchMapper.fromData(searchResponse, searchParams);

      expect(result.sortableAttributes).toHaveLength(2);
      expect(result.sortableAttributes[0].name).toEqual(sortings[0].identifier);
      expect(result.sortableAttributes[0].displayName).toEqual(sortings[0].title);
    });
  });

  describe('mapFilter', () => {
    it('should map filters correctly', () => {
      const facets: FixedFacetGroupResult[] = [
        {
          id: 'color',
          title: 'Color',
          options: [
            { id: 'option_Id1', identifier: 'option_identifier1', score: 1, value: 'value1' },
            { id: 'option_Id2', identifier: 'option_identifier2', score: 10, value: 'value2' },
          ],
        },
      ];

      const searchResponse: SparqueSearchResponse = {
        products: [],
        sortings: [],
        total: 0,
        facets,
      };

      const result = sparqueSearchMapper.fromData(searchResponse, searchParams);

      expect(result.filter[0].name).toBe(facets[0].title);
      expect(result.filter).toHaveLength(1);
      expect(result.filter[0].facets).toHaveLength(2);
      expect(result.filter[0].facets[0].count).toBe(facets[0].options[0].score);
      expect(result.filter[0].facets[0].displayName).toBe(facets[0].options[0].value);
    });
  });
});
