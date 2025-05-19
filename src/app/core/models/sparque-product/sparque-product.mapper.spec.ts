import { TestBed } from '@angular/core/testing';
import { anything, instance, mock, when } from 'ts-mockito';

import { Image } from 'ish-core/models/image/image.model';
import { SparqueImageMapper } from 'ish-core/models/sparque-image/sparque-image.mapper';

import { SparqueProduct } from './sparque-product.interface';
import { SparqueProductMapper } from './sparque-product.mapper';

const sparqueProduct = {
  sku: 'SKU1',
  name: 'Product 1',
  shortDescription: 'Short description',
  defaultBrandName: 'BRAND',
  images: [],
} as SparqueProduct;

const image = {
  effectiveUrl: 'baseUrl/S/123.jpg',
} as Image;

describe('Sparque Product Mapper', () => {
  let sparqueProductMapper: SparqueProductMapper;
  let sparqueImageMapper: SparqueImageMapper;

  beforeEach(() => {
    sparqueImageMapper = mock(SparqueImageMapper);
    when(sparqueImageMapper.fromImages(anything())).thenReturn([image]);

    TestBed.configureTestingModule({
      providers: [{ provide: SparqueImageMapper, useFactory: () => instance(sparqueImageMapper) }],
    });

    sparqueProductMapper = TestBed.inject(SparqueProductMapper);
  });

  describe('fromListData', () => {
    it('should return empty object if products array is empty', () => {
      const result = sparqueProductMapper.fromListData([]);
      expect(result).toMatchInlineSnapshot(`[]`);
    });

    it('should map Sparque products correctly', () => {
      const result = sparqueProductMapper.fromListData([sparqueProduct]);
      expect(result).toMatchInlineSnapshot(`
        [
          {
            "available": true,
            "completenessLevel": 1,
            "images": [
              {
                "effectiveUrl": "baseUrl/S/123.jpg",
              },
            ],
            "manufacturer": "BRAND",
            "name": "Product 1",
            "shortDescription": "Short description",
            "sku": "SKU1",
            "type": "Product",
          },
        ]
      `);
    });
  });
});
