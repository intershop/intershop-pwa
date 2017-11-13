
import { Observable } from 'rxjs/Observable';
import { anything, instance, mock, when } from 'ts-mockito/lib/ts-mockito';
import { ApiService } from '../api.service';
import { SearchBoxService } from './search-box.service';

describe('Search Box Service', () => {
  let searchBoxService: SearchBoxService;
  let apiService: ApiService;
  beforeEach(() => {
    apiService = mock(ApiService);
    searchBoxService = new SearchBoxService(instance(apiService));

  });

  it('should return the matched terms when search term matches one or more products in the available product list', () => {
    when(apiService.get(anything())).thenReturn(Observable.of('Goods'));
    let searchResults;
    searchBoxService.search(Observable.of('g')).subscribe((results) => {
      searchResults = results;
    });
    expect(searchResults).toBe('Goods');
  });

  it('should return a blank array when nothing is entered as searchterm', () => {
    let searchResults;
    searchBoxService.search(Observable.of('')).subscribe((results) => {
      searchResults = results;
    });
    expect(searchResults).toEqual([]);
  });
});
