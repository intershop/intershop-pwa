import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { getStaticEndpoint } from 'ish-core/store/core/configuration';

import { SparqueImageMapper } from './sparque-image.mapper';

const sparqueImageS = {
  id: 'S/img.jpg',
  isPrimaryImage: false,
  attributes: [
    { name: 'image-type', value: 'S' },
    { name: 'image-view', value: 'front' },
  ],
};

const sparqueImageM = {
  id: 'M/img.jpg',
  isPrimaryImage: true,
  attributes: [
    { name: 'image-type', value: 'M' },
    { name: 'image-view', value: 'front' },
  ],
};

const imageUrl = 'L/img.jpg';

const staticEndpoint = 'https://icm.com/INTERSHOP/static/WFS/inSPIRED-inTRONICS_Business-Site/-/inSPIRED/en_US';

describe('Sparque Image Mapper', () => {
  let sparqueImageMapper: SparqueImageMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ selectors: [{ selector: getStaticEndpoint, value: staticEndpoint }] })],
    });
    sparqueImageMapper = TestBed.inject(SparqueImageMapper);
  });

  describe('fromImageUrl', () => {
    it('should map single category image correctly', () => {
      const image = sparqueImageMapper.fromImageUrl(imageUrl);
      expect(image).toMatchInlineSnapshot(`
        {
          "effectiveUrl": "https://icm.com/INTERSHOP/static/WFS/inSPIRED-inTRONICS_Business-Site/-/inSPIRED/en_US/L/img.jpg",
          "imageActualHeight": 500,
          "imageActualWidth": 500,
          "name": "front L",
          "primaryImage": true,
          "type": "Image",
          "typeID": "L",
          "viewID": "front",
        }
      `);
    });

    it('should return undefined if called with undefined', () => {
      const image = sparqueImageMapper.fromImageUrl(undefined);
      expect(image).toBeUndefined();
    });
  });

  describe('fromImages', () => {
    it('should map single product image correctly', () => {
      const result = sparqueImageMapper.fromImages([sparqueImageS, sparqueImageM]);
      expect(result).toMatchInlineSnapshot(`
        [
          {
            "effectiveUrl": "https://icm.com/INTERSHOP/static/WFS/inSPIRED-inTRONICS_Business-Site/-/inSPIRED/en_US/S/img.jpg",
            "imageActualHeight": 110,
            "imageActualWidth": 110,
            "name": "front S",
            "primaryImage": true,
            "type": "Image",
            "typeID": "S",
            "viewID": "front",
          },
          {
            "effectiveUrl": "https://icm.com/INTERSHOP/static/WFS/inSPIRED-inTRONICS_Business-Site/-/inSPIRED/en_US/M/img.jpg",
            "imageActualHeight": 270,
            "imageActualWidth": 270,
            "name": "front M",
            "primaryImage": true,
            "type": "Image",
            "typeID": "M",
            "viewID": "front",
          },
        ]
      `);
    });

    it('should return empty array if called with undefined', () => {
      const result = sparqueImageMapper.fromImages(undefined);
      expect(result).toBeEmpty();
    });
  });
});
