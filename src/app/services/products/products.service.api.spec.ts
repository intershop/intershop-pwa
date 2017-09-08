import { TestBed, async, inject } from '@angular/core/testing';
import { ProductListApiService } from './products.service.api';
import { CustomErrorHandler } from '../../services/custom-error-handler';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../environments/environment';


describe('ProuctListApi Service', () => {
    environment.needMock = true;
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
    });

    it('should call getProductList method', async(inject([ProductListApiService], (productListApiService: ProductListApiService) => {
        const result = productListApiService.getProductList();
        expect(result).toBe(true);
    })));
});
