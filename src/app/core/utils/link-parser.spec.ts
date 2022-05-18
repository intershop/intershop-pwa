import { noop } from 'rxjs';

import { LinkParser } from './link-parser';

describe('Link Parser', () => {
  it.each([
    ['route://category/Computers', '/category/Computers'],
    ['route://category/Home-Entertainment.SmartHome', '/category/Home-Entertainment.SmartHome'],
    ['product://201807195@inSPIRED-inTRONICS', '/product/201807195'],
    ['http://google.de', 'http://google.de'],
    ['https://google.de', 'https://google.de'],
    ['page://my-page', '/page/my-page'],
    ['category://Computers@inSPIRED-Computers', '/categoryref/Computers@inSPIRED-Computers'],
    ['/product/ABC', '/product/ABC'],
    [undefined, undefined],
  ])(`should transform %s to %s without optional baseHref`, (input, output) => {
    expect(LinkParser.parseLink(input)).toEqual(output);
  });

  it.each([
    ['route://category/Computers', '/us/category/Computers'],
    ['route://category/Home-Entertainment.SmartHome', '/us/category/Home-Entertainment.SmartHome'],
    ['product://201807195@inSPIRED-inTRONICS', '/us/product/201807195'],
    ['http://google.de', 'http://google.de'],
    ['https://google.de', 'https://google.de'],
    ['page://my-page', '/us/page/my-page'],
    ['category://Computers@inSPIRED-Computers', '/us/categoryref/Computers@inSPIRED-Computers'],
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
