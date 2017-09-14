
import { Observable } from 'rxjs/Observable';
import { SearchBoxService } from './search-box.service';
import { ApiService } from '../';
import { instance, mock, when, anything } from 'ts-mockito/lib/ts-mockito';

describe('Search Box Service', () => {
    let searchBoxService: SearchBoxService;
    let apiService: ApiService;
    beforeEach(() => {
        apiService = mock(ApiService);
        searchBoxService = new SearchBoxService(instance(apiService));

    });

    it('SearchBox service should return the matched terms when search term matches one or more products in the available product list', () => {
        when(apiService.get(anything())).thenReturn(Observable.of('Goods'));
        let searchResults;
        searchBoxService.search(Observable.of('g')).subscribe((results) => {
            searchResults = results;
        });
        expect(searchResults).toBe('Goods');
    });

    it('SearchBox service should return a blank array when nothing is entered as searchterm', () => {
        let searchResults;
        searchBoxService.search(Observable.of('')).subscribe((results) => {
            searchResults = results;
        });
        expect(searchResults).toEqual([]);
    });
});
