import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';

import { SeoAttributesMapper } from './seo-attributes.mapper';

describe('Seo Attributes Mapper', () => {
  describe('fromData', () => {
    it('should yield nothing when input is falsy', () => {
      expect(SeoAttributesMapper.fromData(undefined)).toBeUndefined();
    });

    it('should convert server data to model data', () => {
      expect(
        SeoAttributesMapper.fromData({
          metaTitle: 'my title',
          metaDescription: 'my description',
          robots: ['index', 'follow'],
        })
      ).toMatchInlineSnapshot(`
        Object {
          "description": "my description",
          "robots": "index, follow",
          "title": "my title",
        }
      `);
    });
  });

  describe('fromCMSData', () => {
    it('should yield nothing when input is falsy', () => {
      expect(SeoAttributesMapper.fromCMSData(undefined)).toBeUndefined();
    });

    it('should convert server data to model data', () => {
      expect(
        SeoAttributesMapper.fromCMSData(({
          configurationParameters: {
            MetaInfo: 'metaTitle=Terms and Conditions;metaDescription=DESC;metaKeywords=terms,conditions',
            RobotsNoFollow: 'true',
            RobotsNoIndex: 'false',
          },
        } as unknown) as ContentPagelet)
      ).toMatchInlineSnapshot(`
        Object {
          "description": "DESC",
          "robots": "index, nofollow",
          "title": "Terms and Conditions",
        }
      `);
    });
  });
});
