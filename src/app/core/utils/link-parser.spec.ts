import * as using from 'jasmine-data-provider';

import { LinkParser } from './link-parser';

describe('Link Parser', () => {
  using(
    [
      { input: 'route://category/Computers', output: '/category/Computers' },
      {
        input: 'route://category/Home-Entertainment.SmartHome',
        output: '/category/Home-Entertainment.SmartHome',
      },
      { input: 'product://201807195@inSPIRED-inTRONICS', output: '/product/201807195' },
      { input: 'http://google.de', output: 'http://google.de' },
      { input: 'https://google.de', output: 'https://google.de' },
      { input: 'page://mypage', output: '/page/mypage' },
      { input: 'category://Computers@inSPIRED-Computers', output: '/category/Computers' },
      { input: '/product/ABC', output: '/product/ABC' },
      { input: 'dummy://something', output: 'dummy://something' },
      { input: undefined, output: undefined },
    ],
    ({ input, output }) => {
      it(`should transform ${input} to ${output}`, () => {
        expect(LinkParser.parseLink(input)).toEqual(output);
      });
    }
  );
});
