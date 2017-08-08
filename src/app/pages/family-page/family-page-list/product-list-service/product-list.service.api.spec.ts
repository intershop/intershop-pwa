import { TestBed, async, inject } from '@angular/core/testing';
import { ProductListApiService } from './product-list.service.api';
import { CustomErrorHandler } from '../../../../shared/services/custom-error-handler';
import { ApiService } from '../../../../shared/services/api.service';


describe('ProuctListApi Service', () => {
    class ApiServiceStub {
        _customErrorHandler = new CustomErrorHandler();
        get(path) {
            return true;
        }
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ProductListApiService,
                { provide: ApiService, useClass: ApiServiceStub }
            ]
        });
    })

    it('should call getProductList method', async(inject([ProductListApiService], (productListApiService: ProductListApiService) => {
        const result = productListApiService.getProductList();
        expect(result).toBe(true);
    })))
});
