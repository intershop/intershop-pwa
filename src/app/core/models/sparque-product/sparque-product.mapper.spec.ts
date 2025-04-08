import { TestBed } from '@angular/core/testing';
import { anything, instance, mock, when } from 'ts-mockito';

import { Product } from 'ish-core/models/product/product.model';
import { SparqueImageMapper } from 'ish-core/models/sparque-image/sparque-image.mapper';
import { SparqueSearchResponse } from 'ish-core/models/sparque-search/sparque-search.interface';

import { SparqueProduct } from './sparque-product.interface';
import { SparqueProductMapper } from './sparque-product.mapper';

const attributes = [{ name: 'Color', value: 'Red' }];

const attachments = [{ id: 'attachment1', extension: 'attachment_ext', relativeUrl: 'attachment_url' }];

const sparqueProduct = {
  name: 'Product 1',
  shortDescription: 'Short description',
  longDescription: 'Long description',
  manufacturer: 'Manufacturer',
  images: [],
  attributes,
  attachments: [],
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

const image = {
  effectiveUrl: 'baseUrl/M/123.jpg',
  primaryImage: true,
  type: 'Image',
  typeID: 'S',
  viewID: 'front',
  name: 'M front',
  imageActualHeight: 110,
  imageActualWidth: 110,
};

const product = {
  name: sparqueProduct.name,
  shortDescription: sparqueProduct.shortDescription,
  longDescription: sparqueProduct.longDescription,
  available: true,
  manufacturer: sparqueProduct.manufacturer,
  images: anything(),
  attributes,
  sku: sparqueProduct.sku,
  attachments: anything(),
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

describe('Sparque Product Mapper', () => {
  let sparqueProductMapper: SparqueProductMapper;
  let sparqueImageMapper: SparqueImageMapper;

  beforeEach(() => {
    sparqueImageMapper = mock(SparqueImageMapper);
    when(sparqueImageMapper.mapProductImages(anything())).thenReturn([image]);

    TestBed.configureTestingModule({
      providers: [{ provide: SparqueImageMapper, useFactory: () => instance(sparqueImageMapper) }],
    });

    sparqueProductMapper = TestBed.inject(SparqueProductMapper);
  });

  describe('mapProducts', () => {
    it('should return empty object if products array is empty', () => {
      const sparqueSearchResonse: SparqueSearchResponse = {
        products: [],
        total: 0,
        facets: [],
        sortings: [],
      };

      const result = sparqueProductMapper.mapProducts(sparqueSearchResonse.products);
      expect(result).toBeEmpty();
    });

    it('should map search response correctly', () => {
      const sparqueSearchResonse: SparqueSearchResponse = {
        products: [sparqueProduct],
        total: 1,
        facets: [],
        sortings: [],
      };

      const result = sparqueProductMapper.mapProducts(sparqueSearchResonse.products);
      expect(result[0].name).toEqual(product.name);
      expect(result[0].manufacturer).toEqual(product.manufacturer);
      expect(result[0].shortDescription).toEqual(product.shortDescription);
      expect(result[0].longDescription).toEqual(product.longDescription);
      expect(result[0].sku).toEqual(product.sku);
      expect(result[0].defaultCategoryId).toEqual(product.defaultCategoryId);
      expect(result[0].attributes).toEqual(product.attributes);
      expect(result[0].attachments).toBeEmpty();
      expect(result[0].images).toHaveLength(1);
      expect(result[0].images).toStrictEqual([image]);
      expect(result).toHaveLength(1);
    });

    it('should map attachments correctly', () => {
      const sparqueSearchResonse: SparqueSearchResponse = {
        products: [{ ...sparqueProduct, attachments }],
        total: 1,
        facets: [],
        sortings: [],
      };

      const result = sparqueProductMapper.mapProducts(sparqueSearchResonse.products);
      expect(result[0].attachments).toHaveLength(1);
      expect(result[0].attachments[0].name).toBe(attachments[0].id);
      expect(result[0].attachments[0].url).toBe(attachments[0].relativeUrl);
    });
  });
});
