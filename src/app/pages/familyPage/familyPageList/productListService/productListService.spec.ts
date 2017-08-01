import { TestBed, async, inject } from '@angular/core/testing';
import { ProductListService } from './productList.service';
import { CustomErrorHandler } from '../../../../shared/services/customErrorHandler';
import { ApiService } from '../../../../shared/services/api.service';
import { InstanceService } from '../../../../shared/services/instance.service';
import { ProductListMockService } from '../../../../pages/familyPage/familyPageList/productListService';


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
