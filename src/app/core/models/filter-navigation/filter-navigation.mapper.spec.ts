import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { getCurrentLocale, getICMStaticURL } from 'ish-core/store/core/configuration';

import { FilterNavigationData } from './filter-navigation.interface';
import { FilterNavigationMapper } from './filter-navigation.mapper';
import { FilterNavigation } from './filter-navigation.model';

describe('Filter Navigation Mapper', () => {
  let mapper: FilterNavigationMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          selectors: [
            { selector: getICMStaticURL, value: 'http://www.example.org/INTERSHOP/static/WFS/Test-Channel-Site/rest' },
            { selector: getCurrentLocale, value: 'de_DE' },
          ],
        }),
      ],
    });
    mapper = TestBed.inject(FilterNavigationMapper);
  });

  describe('fromData', () => {
    it('should return empty FilterNavigation when elements not exists', () => {
      const data = {} as FilterNavigationData;
      const model = mapper.fromData(data);
      expect(model).toEqual({ filter: [] } as FilterNavigation);
    });

    it('should return empty FilterNavigation when elements.length is 0', () => {
      const data = { elements: [] } as FilterNavigationData;
      const model = mapper.fromData(data);
      expect(model).toEqual({ filter: [] } as FilterNavigation);
    });

    it('should parse objects when elements exists with facets', () => {
      const data = {
        elements: [
          { filterEntries: [{ name: 'testName', link: { uri: '/productfilters/uri?FilterName=FilterValue' } }] },
        ],
      } as FilterNavigationData;

      const model = mapper.fromData(data);
      expect(model.filter).toBeTruthy();
      expect(model.filter).toHaveLength(1);
      expect(model.filter[0].facets).toHaveLength(1);
      expect(model.filter[0].facets[0].searchParameter).toMatchInlineSnapshot(`
        {
          "FilterName": [
            "FilterValue",
          ],
          "category": undefined,
        }
      `);
    });

    it('should parse objects when elements exists', () => {
      const data = { elements: [{}] } as FilterNavigationData;
      const model = mapper.fromData(data);
      expect(model.filter).toBeTruthy();
      expect(model.filter).toHaveLength(1);
      expect(model.filter[0].facets).toHaveLength(0);
    });

    it('should use "-" as fallback when currentLocale is undefined for image filter values', () => {
      const data = {
        elements: [
          {
            filterEntries: [
              {
                name: 'testImage',
                link: { uri: '/productfilters/uri?FilterName=FilterValue' },
                mappedType: 'image',
                mappedValue: 'image-unit:/subfolder/image.jpg',
              },
            ],
          },
        ],
      } as FilterNavigationData;

      // Override the private currentLocale property to undefined
      (mapper as unknown as { currentLocale: string }).currentLocale = undefined;

      const model = mapper.fromData(data);
      expect(model.filter[0].facets[0].mappedValue).toBe(
        'url(http://www.example.org/INTERSHOP/static/WFS/Test-Channel-Site/rest/image-unit/-/subfolder/image.jpg)'
      );
    });

    it('should use currentLocale when available for image filter values', () => {
      const data = {
        elements: [
          {
            filterEntries: [
              {
                name: 'testImage',
                link: { uri: '/productfilters/uri?FilterName=FilterValue' },
                mappedType: 'image',
                mappedValue: 'image-unit:/subfolder/image.jpg',
              },
            ],
          },
        ],
      } as FilterNavigationData;

      const model = mapper.fromData(data);
      expect(model.filter[0].facets[0].mappedValue).toBe(
        'url(http://www.example.org/INTERSHOP/static/WFS/Test-Channel-Site/rest/image-unit/de_DE/subfolder/image.jpg)'
      );
    });
  });
});
