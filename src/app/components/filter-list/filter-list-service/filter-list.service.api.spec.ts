import { TestBed, async, inject } from '@angular/core/testing';
import { FilterListApiService } from './filter-list.service.api';
import { CustomErrorHandler, ApiService } from '../../../services';

describe('FilterListApi Service', () => {
    class ApiServiceStub {
        _customErrorHandler = new CustomErrorHandler();
        get(path) {
            return true;
        }
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                FilterListApiService,
                { provide: ApiService, useClass: ApiServiceStub }
            ]
        });
    });

    it('should call getProductList method', async(inject([FilterListApiService], (filterListApiService: FilterListApiService) => {
        const result = filterListApiService.getSideFilters();
        expect(result).toBe(true);
    })
    ));
});
