import { TestBed, async, inject } from '@angular/core/testing';
import { ProductListService } from './product-list.service';
import { CustomErrorHandler } from '../../../../shared/services/custom-error-handler';
import { ApiService } from '../../../../shared/services/api.service';
import { InstanceService } from '../../../../shared/services/instance.service';
import { ProductListMockService } from '../../../../pages/family-page/family-page-list/product-list-service';


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
