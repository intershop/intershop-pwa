import { of } from 'rxjs/observable/of';
import { anything, instance, mock, verify, when } from 'ts-mockito';
import { ApiService } from '../../../core/services/api.service';
import { SearchService } from './search.service';

describe('Search Service', () => {
  let searchService: SearchService;
  const apiService: ApiService = mock(ApiService);

  beforeEach(() => {
    searchService = new SearchService(instance(apiService));
  });

  describe('searchForProductSkus', () => {
    it('should get products based on search term', () => {
      const products = ['Product1', 'Product2'];
      const searchTerm = 'aaa';

      when(apiService.get(anything(), anything(), anything(), anything(), anything())).thenReturn(of(products));
      searchService.searchForProductSkus(searchTerm);

      verify(apiService.get(anything(), anything(), anything(), anything(), anything())).once();
    });
  });
});
