import { SearchParameterMapper } from './search-parameter.mapper';
import { SearchParameter } from './search-parameter.model';

describe('Search Parameter Mapper', () => {
  describe('toData', () => {
    it(`should return parameter string with encoded query term and sortings when SearchParameter query is applied`, () => {
      const searchParameter = new SearchParameter();
      searchParameter.queryTerm = 'camera';
      searchParameter.sortings = ['name-asc', 'sku-desc'];

      expect(SearchParameterMapper.toData(searchParameter)).toEqual('&searchTerm=camera&@Sort.name=0&@Sort.sku=1');
    });
  });
});
