import { TestBed, inject } from '@angular/core/testing';
import { environment } from '../../../../../../environments/environment';
import { InstanceService } from '../../../../../shared/services/instance.service';
import { ApiService } from '../../../../../shared/services/api.service';
import { SearchBoxApiService } from './search-box.service.api';
import { Observable } from 'rxjs/Rx';


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

     it('should call search mehthod', inject([SearchBoxApiService], (searchBoxApiService: SearchBoxApiService) => {
        const urlPassed = searchBoxApiService.search(Observable.of('g'));
        expect(urlPassed).toBeTruthy();
    }));

    it('should call searchEntries method and verify the url passed', inject([SearchBoxApiService], (searchBoxApiService: SearchBoxApiService) => {
        const urlPassed = searchBoxApiService.searchEntries('k');
        expect(urlPassed).toEqual('suggest?SearchTerm=k');
    }));
});
