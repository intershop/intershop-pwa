import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { SearchBoxService } from './search-box.service';
import { SuggestedElement } from './search-box.model';

describe('Search Box Service', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SearchBoxService]
        });
    });

    it('searchresults should not be undefined when data is available in the service', inject([SearchBoxService], (searchBoxService: SearchBoxService) => {
        let searchResults;
        SearchBoxService.searchEntries('g').subscribe((results) => {
            searchResults = results;
        });

        expect(searchResults).not.toBeNull();
    }));

    it('searchresults should be blanck array when data is not available in the service', inject([SearchBoxService], (searchBoxService: SearchBoxService) => {
        let searchResults;
        SearchBoxService.searchEntries('Test').subscribe((results) => {
            searchResults = results;
        });

        expect(searchResults).toEqual([ ]);
    }));
});
