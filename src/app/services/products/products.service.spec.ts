import { TestBed, async, inject } from '@angular/core/testing';
import { ProductListService } from './products.service';
import { CustomErrorHandler } from 'app/services/custom-error-handler';
import { ApiService } from 'app/services/api.service';
import { InstanceService } from 'app/services/instance.service';
import { ProductListMockService } from 'app/services/products/products.service.mock';


describe('ProuctList Service', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ProductListService, InstanceService, ProductListMockService
            ]
        });
    })

    it('should call getProductList method', async(inject([ProductListService], (productListService: ProductListService) => {
        const data = productListService.getProductList();
        expect(data).not.toBe(null);
    })))
});
