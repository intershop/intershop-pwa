import { of } from 'rxjs/observable/of';
import { anything, instance, mock, when } from 'ts-mockito/lib/ts-mockito';
import { ApiService } from '../api.service';
import { SuggestService } from './suggest.service';

describe('Suggest Service', () => {
  let suggestService: SuggestService;
  let apiService: ApiService;
  beforeEach(() => {
    apiService = mock(ApiService);
    suggestService = new SuggestService(instance(apiService));

  });

  // TODO: test needs fixing after suggest service changes
  xit('should return the matched terms when search term matches one or more products in the available product list', () => {
    when(apiService.get(anything())).thenReturn(of('Goods'));
    let searchResults;
    suggestService.search(of('g')).subscribe((results) => {
      searchResults = results;
    });
    expect(searchResults).toBe('Goods');
  });

  it('should return a blank array when nothing is entered as search term', () => {
    let searchResults;
    suggestService.search(of('')).subscribe((results) => {
      searchResults = results;
    });
    expect(searchResults).toEqual([]);
  });
});
