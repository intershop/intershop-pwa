import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { getICMBaseURL } from 'ish-core/store/core/configuration';

import { ImageMapper } from './image.mapper';
import { Image } from './image.model';

describe('Image Mapper', () => {
  let imageMapper: ImageMapper;

  const imagesMockData = [
    {
      name: 'front S',
      type: 'Image',
      imageActualHeight: 110,
      imageActualWidth: 110,
      viewID: 'front',
      effectiveUrl: '/INTERSHOP/static/WFS/inSPIRED-inTRONICS-Site/-/inSPIRED/en_US/S/S_201807171_front.jpg',
      typeID: 'S',
      primaryImage: true,
    },
    {
      name: 'front S',
      type: 'Image',
      imageActualHeight: 110,
      imageActualWidth: 110,
      viewID: 'front',
      effectiveUrl: 'http://10.0.27.51:2000/images/S/S_201807171_front.jpg',
      typeID: 'S',
      primaryImage: false,
    },
  ] as Image[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ selectors: [{ selector: getICMBaseURL, value: 'http://example.org' }] })],
    });
    imageMapper = TestBed.inject(ImageMapper);
  });

  describe('fromImages', () => {
    it(`should return Images when getting an Image`, () => {
      const images = imageMapper.fromImages(imagesMockData);
      expect(images).toBeTruthy();
      expect(images[0].effectiveUrl).toBe(
        'http://example.org/INTERSHOP/static/WFS/inSPIRED-inTRONICS-Site/-/inSPIRED/en_US/S/S_201807171_front.jpg'
      );
      expect(images[1].effectiveUrl).toBe('http://10.0.27.51:2000/images/S/S_201807171_front.jpg');
    });
  });
});
