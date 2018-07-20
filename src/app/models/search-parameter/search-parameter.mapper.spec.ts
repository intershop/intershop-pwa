import { SearchParameterMapper } from './search-parameter.mapper';
import { SearchParameter } from './search-parameter.model';

describe('Search Parameter Mapper', () => {
  describe('fromData', () => {
    it(`should return SearchParameter when queryTerm is applied`, () => {
      const data = 'QFF1ZXJ5VGVybT1jYW1lcmE='; // equals @QueryTerm=camera

      const searchParameter = SearchParameterMapper.fromData(data);
      expect(searchParameter.queryTerm).toEqual('camera');
    });
  });

  describe('toData', () => {
    it(`should return parameter string with encoded query term and sortings when SearchParameter query is applied`, () => {
      const searchParameter = new SearchParameter();
      searchParameter.queryTerm = 'camera';
      searchParameter.sortings = ['name-asc', 'sku-desc'];

      expect(SearchParameterMapper.toData(searchParameter)).toEqual(
        'JkBRdWVyeVRlcm09Y2FtZXJhJkBTb3J0Lm5hbWU9MCZAU29ydC5za3U9MQ=='
      );
    });
  });
});
