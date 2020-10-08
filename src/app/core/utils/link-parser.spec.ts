import { noop } from 'rxjs';

import { LinkParser } from './link-parser';

describe('Link Parser', () => {
  it.each([
    ['route://category/Computers', '/category/Computers'],
    ['route://category/Home-Entertainment.SmartHome', '/category/Home-Entertainment.SmartHome'],
    ['product://201807195@inSPIRED-inTRONICS', '/sku201807195'],
    ['http://google.de', 'http://google.de'],
    ['https://google.de', 'https://google.de'],
    ['page://mypage', '/page/mypage'],
    ['category://Computers@inSPIRED-Computers', '/catComputers'],
    ['/product/ABC', '/product/ABC'],
    [undefined, undefined],
  ])(`should transform %s to %s`, (input, output) => {
    expect(LinkParser.parseLink(input)).toEqual(output);
  });

  it('should log if no mapping could be found', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementationOnce(noop);
    expect(LinkParser.parseLink('dummy://something')).toMatchInlineSnapshot(`"dummy://something"`);
    expect(consoleSpy).toHaveBeenCalledWith('Unknown link type:', 'dummy://something');
  });
});
