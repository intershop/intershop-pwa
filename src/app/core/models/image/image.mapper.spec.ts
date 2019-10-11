import { TestBed, async } from '@angular/core/testing';

import { configurationReducer } from 'ish-core/store/configuration/configuration.reducer';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ngrxTesting({
          reducers: { configuration: configurationReducer },
          config: {
            initialState: { configuration: { baseURL: 'http://example.org' } },
          },
        }),
      ],
    });
    imageMapper = TestBed.get(ImageMapper);
  }));

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
