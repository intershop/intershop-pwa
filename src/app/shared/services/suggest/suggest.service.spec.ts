
import { Observable } from 'rxjs/Observable';
import { anything, instance, mock, when } from 'ts-mockito/lib/ts-mockito';
import { ApiService } from '../../../core/services/api.service';
import { SuggestService } from './suggest.service';

describe('Suggest Service', () => {
  let suggestService: SuggestService;
  let apiService: ApiService;
  beforeEach(() => {
    apiService = mock(ApiService);
    suggestService = new SuggestService(instance(apiService));

  });

  it('should return the matched terms when search term matches one or more products in the available product list', () => {
    when(apiService.get(anything())).thenReturn(Observable.of('Goods'));
    let searchResults;
    suggestService.search(Observable.of('g')).subscribe((results) => {
      searchResults = results;
    });
    expect(searchResults).toBe('Goods');
  });

  it('should return a blank array when nothing is entered as searchterm', () => {
    let searchResults;
    suggestService.search(Observable.of('')).subscribe((results) => {
      searchResults = results;
    });
    expect(searchResults).toEqual([]);
  });
});
