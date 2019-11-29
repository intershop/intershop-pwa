import * as using from 'jasmine-data-provider';
import { noop } from 'rxjs';

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
      { input: undefined, output: undefined },
    ],
    ({ input, output }) => {
      it(`should transform ${input} to ${output}`, () => {
        expect(LinkParser.parseLink(input)).toEqual(output);
      });
    }
  );

  it('should log if no mapping could be found', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementationOnce(noop);
    expect(LinkParser.parseLink('dummy://something')).toMatchInlineSnapshot(`"dummy://something"`);
    expect(consoleSpy).toHaveBeenCalledWith('Unknown link type:', 'dummy://something');
  });
});
