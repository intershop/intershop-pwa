import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { anyString, instance, mock, when } from 'ts-mockito';

import { ImageMapper } from 'ish-core/models/image/image.mapper';
import { getStaticEndpoint } from 'ish-core/store/core/configuration';

import { SparqueImage, SparqueProduct } from './sparque.interface';
import { SparqueMapper } from './sparque.mapper';

const attributes = [{ name: 'Color', value: 'Red' }];

const sparqueImage = {
  id: 'imageID',
  url: '/M/1234.jpg',
  isPrimaryImage: true,
} as SparqueImage;

const image = {
  name: sparqueImage.id,
  type: 'm',
  effectiveUrl: 'url',
  primaryImage: true,
  viewID: '',
  typeID: '',
  imageActualHeight: 0,
  imageActualWidth: 0,
};

const sparqueProduct = {
  name: 'Product 1',
  shortDescription: 'Short description',
  longDescription: 'Long description',
  manufacturer: 'Manufacturer',
  images: [sparqueImage],
  attributes,
  sku: 'SKU1',
  defaultcategoryId: 'cat1',
} as SparqueProduct;

describe('Sparque Mapper', () => {
  let sparqueMapper: SparqueMapper;
  let imageMapperMock: ImageMapper;

  beforeEach(() => {
    imageMapperMock = mock(ImageMapper);
    when(imageMapperMock.fromImageUrl(anyString())).thenReturn([image]);
    TestBed.configureTestingModule({
      providers: [
        { provide: ImageMapper, useFactory: () => instance(imageMapperMock) },
        provideMockStore({
          selectors: [{ selector: getStaticEndpoint, value: 'https://static.url' }],
        }),
      ],
    });

    sparqueMapper = TestBed.inject(SparqueMapper);
  });

  it('should map products correctly', () => {
    const result = sparqueMapper.mapProducts([sparqueProduct]);
    expect(result).toBeTruthy();
    expect(result).toHaveLength(1);
    expect(result[0].name).toEqual(sparqueProduct.name);
    expect(result[0].manufacturer).toEqual(sparqueProduct.manufacturer);
    expect(result[0].shortDescription).toEqual(sparqueProduct.shortDescription);
    expect(result[0].longDescription).toEqual(sparqueProduct.longDescription);
    expect(result[0].available).toBeTrue();
    expect(result[0].sku).toEqual(sparqueProduct.sku);
    expect(result[0].defaultCategoryId).toEqual(sparqueProduct.defaultcategoryId);
    expect(result[0].images).toHaveLength(1);
    expect(result[0].images[0].effectiveUrl).toEqual(image.effectiveUrl);
    expect(result[0].images[0].primaryImage).toBeTrue();
    expect(result[0].attributes).toHaveLength(1);
    expect(result[0].attributes[0].name).toEqual(sparqueProduct.attributes[0].name);
    expect(result[0].attributes[0].value).toEqual(sparqueProduct.attributes[0].value);
  });

  it('should return undefined if no products are provided', () => {
    const result = sparqueMapper.mapProducts(undefined);
    expect(result).toBeUndefined();
  });

  it('should map attributes correctly', () => {
    const result = sparqueMapper.mapAttributes(attributes);
    expect(result).toEqual(attributes);
  });

  it('should return an empty array if no attributes are provided', () => {
    const result = sparqueMapper.mapAttributes(undefined);
    expect(result).toBeEmpty();
  });
});
