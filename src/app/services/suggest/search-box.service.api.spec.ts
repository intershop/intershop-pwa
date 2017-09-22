import { inject, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { ApiService } from '../../services/api.service';
import { SearchBoxApiService } from './search-box.service.api';

describe('Search Box Api Service', () => {
    class ApiServiceStub {
        get(url) {
            return url;
        }
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SearchBoxApiService,
                { provide: ApiService, useClass: ApiServiceStub }
            ]
        });
    });

     it('should call search method', inject([SearchBoxApiService], (searchBoxApiService: SearchBoxApiService) => {
        const searchTerm = searchBoxApiService.search(Observable.of('g'));
        expect(searchTerm).toBeTruthy();
    }));

    it('should call searchEntries method and verify the url passed', inject([SearchBoxApiService], (searchBoxApiService: SearchBoxApiService) => {
        const urlPassed = searchBoxApiService.searchEntries('k');
        expect(urlPassed).toEqual('suggest?SearchTerm=k');
    }));
});
