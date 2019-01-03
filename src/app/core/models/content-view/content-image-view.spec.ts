import * as using from 'jasmine-data-provider';

import { createSimplePageletView } from 'ish-core/utils/dev/test-data-utils';
import { ContentPagelet } from '../content-pagelet/content-pagelet.model';

import { createImagePageletView, getImagePath } from './content-image-view';

describe('Content Image View', () => {
  describe('ContentImagePageletView', () => {
    let pagelet: ContentPagelet;

    beforeEach(() => {
      pagelet = {
        id: 'id',
        definitionQualifiedName: 'fq',
      };
    });

    it('should be created', () => {
      expect(() => createImagePageletView(createSimplePageletView(pagelet))).not.toThrow();
    });

    describe('view created', () => {
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
