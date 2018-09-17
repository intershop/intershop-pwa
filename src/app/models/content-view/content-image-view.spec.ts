import * as using from 'jasmine-data-provider';

import { ContentPagelet } from '../content-pagelet/content-pagelet.model';

import { createImagePageletView, getImagePath, getRouterLink } from './content-image-view';
import { createSimplePageletView } from './content-views';

describe('Content Image View', () => {
  describe('ContentImagePageletView', () => {
    let pagelet: ContentPagelet;

    beforeEach(() => {
      pagelet = {
        id: 'id',
        definitionQualifiedName: 'fq',
        displayName: 'name',
        slots: [],
        configurationParameters: {},
      };
    });

    it('should be created', () => {
      expect(() => createImagePageletView(createSimplePageletView(pagelet))).not.toThrow();
    });

    describe('view created', () => {
      it('should return a routerLink if Link is set', () => {
        const view = createImagePageletView(
          createSimplePageletView({
            ...pagelet,
            configurationParameters: {
              Link: 'route://category/Home-Entertainment.SmartHome',
            },
          })
        );
        expect(view.routerLink('Link')).toEqual('/category/Home-Entertainment.SmartHome');
      });

      it('should return home route if Link is not set', () => {
        const view = createImagePageletView(createSimplePageletView(pagelet));
        expect(view.routerLink('Link')).toEqual('/home');
      });

      it('should return an image path if Image is set', () => {
        const view = createImagePageletView(
          createSimplePageletView({
            ...pagelet,
            configurationParameters: {
              Image: 'foo/bar.png',
            },
          })
        );
        expect(view.imagePath('Image', 'http://example.org')).toEqual('foo/bar.png');
      });

      it('should not return an image path if Image is not set', () => {
        const view = createImagePageletView(createSimplePageletView(pagelet));
        expect(view.imagePath('Image', 'http://example.org')).toBeUndefined();
      });
    });
  });

  describe('getRouterLink', () => {
    using(
      [
        { input: 'route://category/Computers', expected: '/category/Computers' },
        { input: 'route://category/Home-Entertainment.SmartHome', expected: '/category/Home-Entertainment.SmartHome' },
        { input: 'product://201807195@inSPIRED-inTRONICS', expected: '/product/201807195' },
      ],
      ({ input, expected }) => {
        it(`should transform ${input} to ${expected}`, () => {
          // tslint:disable-next-line deprecation
          expect(getRouterLink(input)).toEqual(expected);
        });
      }
    );
  });

  describe('getImagePath', () => {
    using(
      [
        {
          input: 'assets/pwa/pwa_home_teaser_1.jpg',
          staticUrl: 'http://example.org',
          expected: 'assets/pwa/pwa_home_teaser_1.jpg',
        },
        {
          input: 'site:/pwa/pwa_home_teaser_1.jpg',
          staticUrl: 'http://example.org',
          expected: 'http://example.org/site/-/pwa/pwa_home_teaser_1.jpg',
        },
      ],
      ({ input, staticUrl, expected }) => {
        it(`should transform ${input} to ${expected}`, () => {
          // tslint:disable-next-line deprecation
          expect(getImagePath(input, staticUrl)).toEqual(expected);
        });
      }
    );
  });
});
