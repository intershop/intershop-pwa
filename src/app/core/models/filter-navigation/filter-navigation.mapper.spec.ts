import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { getICMStaticURL } from 'ish-core/store/core/configuration';

import { FilterNavigationData } from './filter-navigation.interface';
import { FilterNavigationMapper } from './filter-navigation.mapper';
import { FilterNavigation } from './filter-navigation.model';

describe('Filter Navigation Mapper', () => {
  let mapper: FilterNavigationMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ selectors: [{ selector: getICMStaticURL, value: 'http://www.example.org' }] })],
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
        elements: [{ filterEntries: [{ name: 'testName', link: { uri: '/filters/uri?SearchParameter=param' } }] }],
      } as FilterNavigationData;

      const model = mapper.fromData(data);
      expect(model.filter).toBeTruthy();
      expect(model.filter).toHaveLength(1);
      expect(model.filter[0].facets).toHaveLength(1);
      expect(model.filter[0].facets[0].searchParameter).toMatchInlineSnapshot(`
        Object {
          "SearchParameter": Array [
            "param",
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
  });
});
