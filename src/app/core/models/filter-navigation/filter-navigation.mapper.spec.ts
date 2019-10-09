import { TestBed, async } from '@angular/core/testing';

import { configurationReducer } from 'ish-core/store/configuration/configuration.reducer';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { FilterNavigationData } from './filter-navigation.interface';
import { FilterNavigationMapper } from './filter-navigation.mapper';
import { FilterNavigation } from './filter-navigation.model';

describe('Filter Navigation Mapper', () => {
  let mapper: FilterNavigationMapper;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ngrxTesting({
          reducers: { configuration: configurationReducer },
          config: {
            initialState: {
              configuration: { baseURL: 'http://www.example.org' },
            },
          },
        }),
      ],
    });
    mapper = TestBed.get(FilterNavigationMapper);
  }));

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
        elements: [{ facets: [{ name: 'testName', link: { uri: '/filters/uri;SearchParameter=param' } }] }],
      } as FilterNavigationData;

      const model = mapper.fromData(data);
      expect(model.filter).toBeTruthy();
      expect(model.filter).toHaveLength(1);
      expect(model.filter[0].facets).toHaveLength(1);
      expect(model.filter[0].facets[0].searchParameter).toBe('param');
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
