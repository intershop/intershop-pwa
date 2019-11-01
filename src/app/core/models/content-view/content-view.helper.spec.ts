import * as using from 'jasmine-data-provider';

import { ContentViewHelper } from './content-view.helper';
import { createContentPageletView } from './content-view.model';

describe('Content View Helper', () => {
  describe('getRouterLink', () => {
    using(
      [
        { input: 'route://category/Computers', expected: '/category/Computers' },
        { input: 'route://category/Home-Entertainment.SmartHome', expected: '/category/Home-Entertainment.SmartHome' },
        { input: 'product://201807195@inSPIRED-inTRONICS', expected: '/product/201807195' },
      ],
      ({ input, expected }) => {
        it(`should transform ${input} to ${expected}`, () => {
          const pagelet = createContentPageletView({
            definitionQualifiedName: 'fq',
            id: 'id',
            domain: 'domain',
            displayName: 'name',
            configurationParameters: {
              Link: input,
            },
          });

          expect(ContentViewHelper.getRouterLink(pagelet, 'Link')).toEqual(expected);
        });
      }
    );
  });

  describe('isRouterLink', () => {
    using(
      [
        { input: 'route://category/Computers', expected: true },
        { input: 'product://201807195@inSPIRED-inTRONICS', expected: true },
        { input: 'page://page.aboutus', expected: true },
        { input: 'http://example.com', expected: false },
        { input: 'https://example.com', expected: false },
      ],
      ({ input, expected }) => {
        it(`should evalute ${input} to ${expected}`, () => {
          const pagelet = createContentPageletView({
            definitionQualifiedName: 'fq',
            id: 'id',
            domain: 'domain',
            displayName: 'name',
            configurationParameters: {
              Link: input,
            },
          });

          expect(ContentViewHelper.isRouterLink(pagelet, 'Link')).toEqual(expected);
        });
      }
    );
  });
});
