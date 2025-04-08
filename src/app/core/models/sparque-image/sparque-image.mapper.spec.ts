import { TestBed } from '@angular/core/testing';

import { SparqueImageMapper } from './sparque-image.mapper';

const sparqueImage1 = {
  id: 'img1',
  url: '/images/img1.jpg',
  isPrimaryImage: true,
  attributes: [
    { name: 'image-type', value: 'S' },
    { name: 'image-view', value: 'front' },
  ],
};

const sparqueImage2 = {
  id: 'img2',
  url: '/images/img2.jpg',
  isPrimaryImage: false,
  attributes: [
    { name: 'image-type', value: 'M' },
    { name: 'image-view', value: 'front' },
  ],
};

const images = [
  {
    type: 'Image',
    effectiveUrl: sparqueImage1.id,
    viewID: 'front',
    typeID: 'S',
    name: 'front S',
    imageActualHeight: 110,
    imageActualWidth: 110,
    primaryImage: true,
  },
  {
    type: 'Image',
    effectiveUrl: sparqueImage2.id,
    viewID: 'front',
    typeID: 'M',
    name: 'front M',
    imageActualHeight: 270,
    imageActualWidth: 270,
    primaryImage: false,
  },
];

const categoryAttributes = [{ name: 'image', value: 'images/img3.jpg' }];

describe('Sparque Image Mapper', () => {
  let sparqueImageMapper: SparqueImageMapper;

  beforeEach(() => {
    sparqueImageMapper = TestBed.inject(SparqueImageMapper);
  });

  describe('mapProductImages', () => {
    it('should map single product image correctly', () => {
      const result = sparqueImageMapper.mapProductImages([sparqueImage1]);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(images[0]);
    });

    it('should map all product images correctly', () => {
      const result = sparqueImageMapper.mapProductImages([sparqueImage1, sparqueImage2]);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(images[0]);
      expect(result[1]).toEqual(images[1]);
    });

    it('should return empty array if called with undefined', () => {
      const result = sparqueImageMapper.mapProductImages(undefined);
      expect(result).toBeEmpty();
    });
  });

  describe('mapCategoryImage', () => {
    it('should map single category image correctly', () => {
      const result = sparqueImageMapper.mapCategoryImage(categoryAttributes);
      expect(result).toHaveLength(1);
      expect(result[0].effectiveUrl).toEqual(categoryAttributes[0].value);
      expect(result[0].viewID).toEqual('front');
      expect(result[0].typeID).toEqual('S');
      expect(result[0].name).toEqual('front S');
      expect(result[0].imageActualHeight).toEqual(110);
      expect(result[0].imageActualWidth).toEqual(110);
      expect(result[0].primaryImage).toBeTrue();
    });
    it('should return empty array if called with undefined', () => {
      const result = sparqueImageMapper.mapCategoryImage(undefined);
      expect(result).toBeEmpty();
    });
  });
});
