import * as using from 'jasmine-data-provider';

import { createSimplePageletView } from 'ish-core/utils/dev/test-data-utils';

import { ContentViewHelper } from './content-view.helper';

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
          const pagelet = createSimplePageletView({
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
});
