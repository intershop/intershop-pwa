import { ContentViewHelper } from './content-view.helper';
import { createContentPageletView } from './content-view.model';

describe('Content View Helper', () => {
  describe('getRouterLink', () => {
    it.each([
      ['route://category/Computers', '/category/Computers'],
      ['route://category/Home-Entertainment.SmartHome', '/category/Home-Entertainment.SmartHome'],
      ['product://201807195@inSPIRED-inTRONICS', '/sku201807195'],
    ])(`should transform %s to %s`, (input, expected) => {
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
  });

  describe('Content View Helper', () => {
    it.each([
      ['route://category/Computers', true],
      ['product://201807195@inSPIRED-inTRONICS', true],
      ['page://page.aboutus', true],
      ['http://example.com', false],
      ['https://example.com', false],
    ])(`should evalute %s to %s`, (input, expected) => {
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
  });
});
