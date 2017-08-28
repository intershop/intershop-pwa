import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { SearchBoxService } from './search-box.service';
import { SuggestedElement } from './search-box.model';
import { environment } from '../../../../../../environments/environment';
import { InstanceService } from '../../../../../shared/services/instance.service';
import { SearchBoxMockService } from './search-box.service.mock';

describe('Search Box Service', () => {
    environment.needMock = true;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SearchBoxService,
                InstanceService, SearchBoxMockService
            ]
        });
    });

    it('search results should not be null when search term matches one or more products in the available product list', inject([SearchBoxService], (searchBoxService: SearchBoxService) => {
        let searchResults;
        searchBoxService.search(Observable.of('g')).subscribe((results) => {
            searchResults = results;
        });

        expect(searchResults).not.toBeNull();
    }));

    it('search results should be blank array when search term dont match any product in the available product list', inject([SearchBoxService], (searchBoxService: SearchBoxService) => {
        let searchResults;
        searchBoxService.search(Observable.of('test')).subscribe((results) => {
            searchResults = results;
        });

        expect(searchResults.elements).toEqual([]);
    }));
});
