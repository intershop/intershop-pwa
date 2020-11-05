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
  ])(`should transform %s to %s without optional baseHref`, (input, output) => {
    expect(LinkParser.parseLink(input)).toEqual(output);
  });

  it.each([
    ['route://category/Computers', '/us/category/Computers'],
    ['route://category/Home-Entertainment.SmartHome', '/us/category/Home-Entertainment.SmartHome'],
    ['product://201807195@inSPIRED-inTRONICS', '/us/sku201807195'],
    ['http://google.de', 'http://google.de'],
    ['https://google.de', 'https://google.de'],
    ['page://mypage', '/us/page/mypage'],
    ['category://Computers@inSPIRED-Computers', '/us/catComputers'],
    ['/product/ABC', '/product/ABC'],
    [undefined, undefined],
  ])(`should transform %s to %s with baseHref /us`, (input, output) => {
    expect(LinkParser.parseLink(input, '/us')).toEqual(output);
  });

  it('should log if no mapping could be found', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementationOnce(noop);
    expect(LinkParser.parseLink('dummy://something')).toMatchInlineSnapshot(`"dummy://something"`);
    expect(consoleSpy).toHaveBeenCalledWith('Unknown link type:', 'dummy://something');
  });
});
